import { backendFetch, readBackendError } from '$lib/server/backend';
import type { TokenResponse } from '$lib/types';
import type { Cookies } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/app/dashboard');
  }
};

async function createSession(alias: string, password: string, cookies: Cookies) {
  const response = await backendFetch('/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      username: alias,
      password
    })
  });

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      error: await readBackendError(response)
    };
  }

  const payload = (await response.json()) as TokenResponse;

  cookies.set('auth_token', payload.access_token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 30
  });

  return {
    ok: true as const
  };
}

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const alias = String(formData.get('alias') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!alias || !password) {
      return fail(400, {
        error: 'Completa alias y contrasena para iniciar sesion.',
        mode: 'login',
        values: { alias }
      });
    }

    const session = await createSession(alias, password, cookies);

    if (!session.ok) {
      return fail(session.status, {
        error: session.error,
        mode: 'login',
        values: { alias }
      });
    }

    throw redirect(303, '/app/dashboard');
  },

  register: async ({ request, cookies }) => {
    const formData = await request.formData();
    const alias = String(formData.get('alias') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    if (!alias || !password || !confirmPassword) {
      return fail(400, {
        error: 'Completa alias, contrasena y confirmacion para crear la cuenta.',
        mode: 'register',
        values: { alias }
      });
    }

    if (password !== confirmPassword) {
      return fail(400, {
        error: 'Las contrasenas no coinciden.',
        mode: 'register',
        values: { alias }
      });
    }

    const registerResponse = await backendFetch('/auth/register', {
      method: 'POST',
      body: {
        alias,
        password
      }
    });

    if (!registerResponse.ok) {
      return fail(registerResponse.status, {
        error: await readBackendError(registerResponse),
        mode: 'register',
        values: { alias }
      });
    }

    const session = await createSession(alias, password, cookies);

    if (!session.ok) {
      return fail(session.status, {
        error: 'La cuenta se creo, pero no se pudo iniciar sesion automaticamente. Intenta entrar con tus credenciales.',
        mode: 'login',
        values: { alias }
      });
    }

    throw redirect(303, '/app/dashboard');
  }
};
