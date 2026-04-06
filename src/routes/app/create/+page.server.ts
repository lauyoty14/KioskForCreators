import { mergeConversationDrafts, appendConversationIteration } from '$lib/server/conversation-drafts';
import { backendFetch, backendJson, readBackendError } from '$lib/server/backend';
import { normalizeConversation } from '$lib/normalizers';
import type { Conversacion, Mensaje, Pantalla } from '$lib/types';
import { isStaticAsset } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

async function createConversation(token: string | null, generadorId: number): Promise<Conversacion> {
  return backendJson<Conversacion>('/conversations/', {
    method: 'POST',
    token,
    body: {
      generador_id: generadorId
    }
  });
}

function latestImage(messages: Mensaje[]): Mensaje | null {
  return [...messages].reverse().find((message) => message.role === 'assistant' && isStaticAsset(message.content)) ?? null;
}

function extractAssetFilename(assetPath: string): string | null {
  if (!isStaticAsset(assetPath)) {
    return null;
  }

  const normalizedPath = assetPath.split('?')[0] ?? assetPath;
  const filename = normalizedPath.replace(/^\/static\//, '').trim();
  return filename || null;
}

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
  const [screens, rawConversations] = await Promise.all([
    backendJson<Pantalla[]>('/generators/mis-pantallas', { token: locals.token }),
    backendJson<unknown[]>(`/conversations/generator/${locals.user!.id}`, {
      token: locals.token
    }).catch(() => [])
  ]);

  const conversations = mergeConversationDrafts(
    rawConversations
      .map(normalizeConversation)
      .filter((conversation): conversation is Conversacion => Boolean(conversation)),
    cookies
  );

  const sortedConversations = [...conversations].sort((left, right) => right.id - left.id);
  const selectedConversationId = Number(url.searchParams.get('conversation') ?? sortedConversations[0]?.id ?? 0);
  const selectedConversation =
    sortedConversations.find((conversation) => conversation.id === selectedConversationId) ?? null;

  return {
    screens,
    conversations: sortedConversations,
    selectedConversation,
    selectedConversationId,
    justAssigned: url.searchParams.get('assigned') === '1',
    latestGeneratedImage: selectedConversation ? latestImage(selectedConversation.mensajes) : null
  };
};

export const actions: Actions = {
  start: async ({ locals }) => {
    const conversation = await createConversation(locals.token, locals.user!.id);
    throw redirect(303, `/app/create?conversation=${conversation.id}`);
  },

  send: async ({ request, locals, cookies }) => {
    const formData = await request.formData();
    const prompt = String(formData.get('prompt') ?? '').trim();
    let conversationId = Number(formData.get('conversationId') ?? 0);
    const baseImageUrl = String(formData.get('baseImageUrl') ?? '').trim();

    if (!prompt) {
      return fail(400, {
        sendError: 'Escribe un prompt antes de enviarlo.'
      });
    }

    if (!conversationId) {
      const conversation = await createConversation(locals.token, locals.user!.id);
      conversationId = conversation.id;
    }

    if (baseImageUrl) {
      const imageFilename = extractAssetFilename(baseImageUrl);

      if (!imageFilename) {
        return fail(400, {
          sendError: 'No se pudo identificar la imagen base para iterar.'
        });
      }

      const params = new URLSearchParams({
        prompt,
        image_filename: imageFilename
      });

      const response = await backendFetch(`/content/iterate?${params.toString()}`, {
        method: 'POST',
        token: locals.token
      });

      if (!response.ok) {
        return fail(response.status, {
          sendError: await readBackendError(response)
        });
      }

      const payload = (await response.json()) as { image_url?: string; error?: string };

      if (!payload.image_url) {
        return fail(500, {
          sendError: payload.error || 'No se pudo iterar la imagen actual.'
        });
      }

      appendConversationIteration(cookies, conversationId, prompt, payload.image_url);
      throw redirect(303, `/app/create?conversation=${conversationId}`);
    }

    const response = await backendFetch('/messages/', {
      method: 'POST',
      token: locals.token,
      body: {
        conversacion_id: conversationId,
        role: 'user',
        content: prompt
      }
    });

    if (!response.ok) {
      return fail(response.status, {
        sendError: await readBackendError(response)
      });
    }

    throw redirect(303, `/app/create?conversation=${conversationId}`);
  },

  assign: async ({ request, locals }) => {
    const formData = await request.formData();
    const screenIds = formData
      .getAll('screenIds')
      .map((screenId) => Number(screenId))
      .filter(Boolean);
    const imageUrl = String(formData.get('imageUrl') ?? '').trim();
    const conversationId = Number(formData.get('conversationId') ?? 0);

    if (!imageUrl) {
      return fail(400, {
        assignError: 'No hay una imagen generada para asignar.'
      });
    }

    if (screenIds.length === 0) {
      return fail(400, {
        assignError: 'Selecciona al menos una pantalla.'
      });
    }

    const response = await backendFetch('/content/confirm', {
      method: 'POST',
      token: locals.token,
      body: {
        datos_nuevo_contenido: {
          url: imageUrl,
          fecha_creacion: new Date().toISOString()
        },
        pantallas_id: screenIds
      }
    });

    if (!response.ok) {
      return fail(response.status, {
        assignError: await readBackendError(response)
      });
    }

    throw redirect(303, `/app/create?conversation=${conversationId}&assigned=1`);
  }
};
