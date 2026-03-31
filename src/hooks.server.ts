import { backendFetch } from '$lib/server/backend';
import type { GeneradorPublic } from '$lib/types';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('auth_token') ?? null;

  event.locals.token = token;
  event.locals.user = null;

  if (token) {
    try {
      const response = await backendFetch('/auth/me', {
        token,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        event.locals.user = (await response.json()) as GeneradorPublic;
      } else if (response.status === 401) {
        event.cookies.delete('auth_token', { path: '/' });
        event.locals.token = null;
      }
    } catch {
      event.locals.user = null;
    }
  }

  return resolve(event);
};
