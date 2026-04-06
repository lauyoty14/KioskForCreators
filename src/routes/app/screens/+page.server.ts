import { normalizeConversation } from '$lib/normalizers';
import { mergeConversationDrafts } from '$lib/server/conversation-drafts';
import { apiBaseUrl, backendFetch, backendJson, readBackendError } from '$lib/server/backend';
import type { Contenido, Conversacion, Pantalla } from '$lib/types';
import { conversationPreview, isStaticAsset } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface CarouselLibraryItem {
  id: string;
  imageUrl: string;
  conversationId: number;
  conversationName: string;
  prompt: string;
  variationLabel: string;
}

function firstPrompt(conversation: Conversacion): string {
  return conversationPreview(
    conversation.mensajes.find((message) => message.role === 'user')?.content
  );
}

function buildLibrary(conversations: Conversacion[]): CarouselLibraryItem[] {
  return conversations
    .flatMap((conversation) => {
      const prompt = firstPrompt(conversation);
      const images = conversation.mensajes.filter(
        (message) => message.role === 'assistant' && isStaticAsset(message.content)
      );

      return images.map((message, index) => ({
        id: `${conversation.id}-${message.id}`,
        imageUrl: message.content,
        conversationId: conversation.id,
        conversationName: `Conversacion #${conversation.id}`,
        prompt,
        variationLabel: `Variacion ${index + 1} de ${images.length}`
      }));
    })
    .sort((left, right) => {
      const [leftConversation, leftMessage] = left.id.split('-').map(Number);
      const [rightConversation, rightMessage] = right.id.split('-').map(Number);

      if (rightConversation !== leftConversation) {
        return rightConversation - leftConversation;
      }

      return rightMessage - leftMessage;
    })
    .slice(0, 6);
}

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
  const [screens, rawConversations] = await Promise.all([
    backendJson<Pantalla[]>('/generators/mis-pantallas', {
      token: locals.token
    }),
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

  const library = buildLibrary(conversations);

  const contentsByScreen = Object.fromEntries(
    await Promise.all(
      screens.map(async (screen) => [
        screen.id,
        (await backendJson<Contenido[]>(`/pantallas/${screen.id}/contenido`, {
          token: locals.token
        }).catch(() => []))
          .sort((left, right) => {
            if (left.fecha_creacion === right.fecha_creacion) {
              return right.id - left.id;
            }

            return String(right.fecha_creacion).localeCompare(String(left.fecha_creacion));
          })
      ])
    )
  ) as Record<number, Contenido[]>;

  const selectedScreenId = Number(url.searchParams.get('screen') ?? screens[0]?.id ?? 0);
  const selectedScreen = screens.find((screen) => screen.id === selectedScreenId) ?? null;
  const manageMode = url.searchParams.get('manage') === '1' && Boolean(selectedScreen);

  return {
    apiBaseUrl,
    screens,
    screenContentCounts: Object.fromEntries(
      screens.map((screen) => [screen.id, contentsByScreen[screen.id]?.length ?? 0])
    ) as Record<number, number>,
    linked: url.searchParams.get('linked') === '1',
    manageMode,
    selectedScreenId,
    selectedScreen,
    selectedScreenContents: selectedScreen ? contentsByScreen[selectedScreen.id] ?? [] : [],
    carouselLibrary: library,
    carouselUpdated: url.searchParams.get('carousel') === 'added',
    carouselRemoved: url.searchParams.get('carousel') === 'removed'
  };
};

export const actions: Actions = {
  link: async ({ request, locals }) => {
    const formData = await request.formData();
    const code = String(formData.get('code') ?? '').trim();

    if (!code) {
      return fail(400, {
        linkError: 'Ingresa un codigo de vinculacion valido.'
      });
    }

    const response = await backendFetch(`/generators/vincular_pantalla/${encodeURIComponent(code)}`, {
      method: 'POST',
      token: locals.token
    });

    if (!response.ok) {
      return fail(response.status, {
        linkError: await readBackendError(response)
      });
    }

    throw redirect(303, '/app/screens?linked=1');
  },

  addToCarousel: async ({ request, locals }) => {
    const formData = await request.formData();
    const screenId = Number(formData.get('screenId') ?? 0);
    const imageUrl = String(formData.get('imageUrl') ?? '').trim();

    if (!screenId) {
      return fail(400, {
        carouselError: 'Selecciona una pantalla para actualizar el carrusel.'
      });
    }

    if (!imageUrl) {
      return fail(400, {
        carouselError: 'Elige una pieza visual valida para agregar.'
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
        pantallas_id: [screenId]
      }
    });

    if (!response.ok) {
      return fail(response.status, {
        carouselError: await readBackendError(response)
      });
    }

    throw redirect(303, `/app/screens?screen=${screenId}&manage=1&carousel=added`);
  },

  removeFromCarousel: async ({ request, locals }) => {
    const formData = await request.formData();
    const screenId = Number(formData.get('screenId') ?? 0);
    const contentId = Number(formData.get('contentId') ?? 0);

    if (!screenId || !contentId) {
      return fail(400, {
        carouselError: 'No se pudo identificar el elemento que quieres quitar.'
      });
    }

    const response = await backendFetch(`/pantallas/${screenId}/contenido/${contentId}`, {
      method: 'DELETE',
      token: locals.token
    });

    if (!response.ok) {
      return fail(response.status, {
        carouselError: await readBackendError(response)
      });
    }

    throw redirect(303, `/app/screens?screen=${screenId}&manage=1&carousel=removed`);
  }
};
