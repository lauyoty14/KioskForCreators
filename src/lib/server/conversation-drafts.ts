import type { Conversacion, Mensaje } from '$lib/types';
import type { Cookies } from '@sveltejs/kit';

const DRAFT_COOKIE_NAME = 'conversation_drafts';
const MAX_DRAFT_MESSAGES_PER_CONVERSATION = 12;
const MAX_DRAFT_CONVERSATIONS = 10;
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

type DraftStore = Record<string, Mensaje[]>;

function isDraftMessage(value: unknown): value is Mensaje {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Mensaje>;

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.conversacion_id === 'number' &&
    (candidate.role === 'user' || candidate.role === 'assistant') &&
    typeof candidate.content === 'string'
  );
}

function readStore(cookies: Cookies): DraftStore {
  const raw = cookies.get(DRAFT_COOKIE_NAME);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([conversationId, messages]) => Number(conversationId) > 0 && Array.isArray(messages))
        .map(([conversationId, messages]) => [
          conversationId,
          messages.filter(isDraftMessage)
        ])
        .filter(([, messages]) => messages.length > 0)
    );
  } catch {
    return {};
  }
}

function latestMessageId(messages: Mensaje[]): number {
  return messages.reduce((latest, message) => Math.max(latest, message.id), 0);
}

function writeStore(cookies: Cookies, store: DraftStore): void {
  const trimmedStore = Object.fromEntries(
    Object.entries(store)
      .filter(([, messages]) => messages.length > 0)
      .sort((left, right) => latestMessageId(right[1]) - latestMessageId(left[1]))
      .slice(0, MAX_DRAFT_CONVERSATIONS)
  );

  if (Object.keys(trimmedStore).length === 0) {
    cookies.delete(DRAFT_COOKIE_NAME, { path: '/' });
    return;
  }

  cookies.set(DRAFT_COOKIE_NAME, JSON.stringify(trimmedStore), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: ONE_WEEK_IN_SECONDS
  });
}

export function mergeConversationDrafts(conversations: Conversacion[], cookies: Cookies): Conversacion[] {
  const store = readStore(cookies);

  return conversations.map((conversation) => {
    const drafts = store[String(conversation.id)] ?? [];

    if (drafts.length === 0) {
      return conversation;
    }

    return {
      ...conversation,
      mensajes: [...conversation.mensajes, ...drafts]
    };
  });
}

export function appendConversationIteration(
  cookies: Cookies,
  conversationId: number,
  prompt: string,
  imageUrl: string
): void {
  const store = readStore(cookies);
  const key = String(conversationId);
  const baseId = Date.now() * 100 + Math.floor(Math.random() * 100);
  const nextMessages: Mensaje[] = [
    {
      id: baseId,
      conversacion_id: conversationId,
      role: 'user',
      content: prompt
    },
    {
      id: baseId + 1,
      conversacion_id: conversationId,
      role: 'assistant',
      content: imageUrl
    }
  ];

  store[key] = [...(store[key] ?? []), ...nextMessages].slice(-MAX_DRAFT_MESSAGES_PER_CONVERSATION);
  writeStore(cookies, store);
}
