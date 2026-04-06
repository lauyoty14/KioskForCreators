import { backendJson } from '$lib/server/backend';
import { normalizeConversation } from '$lib/normalizers';
import { mergeConversationDrafts } from '$lib/server/conversation-drafts';
import type { Conversacion, Mensaje, Pantalla } from '$lib/types';
import { isStaticAsset } from '$lib/utils';
import type { PageServerLoad } from './$types';

type RecentImage = {
  id: number;
  content: string;
  conversationId: number;
  prompt: string;
  variantNumber: number;
  totalVariants: number;
  messageCount: number;
  isLatestInConversation: boolean;
};

function summarizePrompt(prompt: string | undefined, maxLength = 96): string {
  const cleanPrompt = (prompt || '').replace(/\s+/g, ' ').trim();

  if (!cleanPrompt) {
    return 'Exploracion visual sin brief registrado';
  }

  if (cleanPrompt.length <= maxLength) {
    return cleanPrompt;
  }

  return `${cleanPrompt.slice(0, maxLength - 1).trim()}…`;
}

function buildRecentImages(conversations: Conversacion[]): RecentImage[] {
  return conversations.flatMap((conversation) => {
    let lastUserPrompt = '';
    let imageCounter = 0;
    const totalVariants = conversation.mensajes.filter(
      (message) => message.role === 'assistant' && isStaticAsset(message.content)
    ).length;

    return conversation.mensajes.flatMap((message) => {
      if (message.role === 'user' && !isStaticAsset(message.content)) {
        lastUserPrompt = message.content;
        return [];
      }

      if (message.role === 'assistant' && isStaticAsset(message.content)) {
        imageCounter += 1;

        return [
          {
            id: message.id,
            content: message.content,
            conversationId: conversation.id,
            prompt: summarizePrompt(lastUserPrompt),
            variantNumber: imageCounter,
            totalVariants,
            messageCount: conversation.mensajes.length,
            isLatestInConversation: imageCounter === totalVariants
          }
        ];
      }

      return [];
    });
  });
}

export const load: PageServerLoad = async ({ locals, cookies }) => {
  const token = locals.token;
  const user = locals.user;

  const [screens, rawConversations] = await Promise.all([
    backendJson<Pantalla[]>('/generators/mis-pantallas', { token }),
    backendJson<unknown[]>(`/conversations/generator/${user!.id}`, { token }).catch(() => [])
  ]);

  const conversations = mergeConversationDrafts(
    rawConversations
      .map(normalizeConversation)
      .filter((conversation): conversation is Conversacion => Boolean(conversation)),
    cookies
  );

  const recentImages: RecentImage[] = buildRecentImages(conversations)
    .sort((left, right) => right.id - left.id)
    .slice(0, 4);

  return {
    screenCount: screens.length,
    conversationCount: conversations.length,
    imageCount: recentImages.length,
    recentImages
  };
};
