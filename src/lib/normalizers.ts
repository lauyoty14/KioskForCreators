import type { Conversacion, Mensaje } from '$lib/types';

function normalizeMessage(value: unknown): Mensaje | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<Mensaje>;

  if (
    typeof candidate.id !== 'number' ||
    typeof candidate.conversacion_id !== 'number' ||
    (candidate.role !== 'user' && candidate.role !== 'assistant') ||
    typeof candidate.content !== 'string'
  ) {
    return null;
  }

  return {
    id: candidate.id,
    conversacion_id: candidate.conversacion_id,
    role: candidate.role,
    content: candidate.content
  };
}

export function normalizeConversation(value: unknown): Conversacion | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<Conversacion> & { mensajes?: unknown };

  if (typeof candidate.id !== 'number' || typeof candidate.generador_id !== 'number') {
    return null;
  }

  const mensajes = Array.isArray(candidate.mensajes)
    ? candidate.mensajes.map(normalizeMessage).filter((message): message is Mensaje => Boolean(message))
    : [];

  return {
    id: candidate.id,
    generador_id: candidate.generador_id,
    mensajes
  };
}
