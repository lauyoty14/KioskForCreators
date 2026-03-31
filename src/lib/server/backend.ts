import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';

export const apiBaseUrl = (env.PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

type JsonLike = string | number | boolean | null | Record<string, unknown> | unknown[];

interface BackendRequestOptions extends Omit<RequestInit, 'body'> {
  token?: string | null;
  body?: BodyInit | JsonLike;
}

export function backendUrl(path: string): string {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function readBackendError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      detail?: string;
      error?: string;
      message?: string;
    };

    return payload.detail || payload.error || payload.message || 'El backend devolvio un error';
  } catch {
    return response.statusText || 'El backend devolvio un error';
  }
}

export async function backendFetch(path: string, options: BackendRequestOptions = {}): Promise<Response> {
  const { token, headers, body, ...init } = options;
  const finalHeaders = new Headers(headers);
  let finalBody: BodyInit | undefined;

  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  if (
    body !== undefined &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    typeof body !== 'string' &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer)
  ) {
    finalHeaders.set('Content-Type', 'application/json');
    finalBody = JSON.stringify(body);
  } else if (body !== undefined) {
    finalBody = body as BodyInit;
  }

  return fetch(backendUrl(path), {
    ...init,
    headers: finalHeaders,
    body: finalBody
  });
}

export async function backendJson<T>(path: string, options: BackendRequestOptions = {}): Promise<T> {
  const response = await backendFetch(path, options);

  if (!response.ok) {
    throw error(response.status, await readBackendError(response));
  }

  return (await response.json()) as T;
}
