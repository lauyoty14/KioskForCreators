import { backendFetch, readBackendError } from '$lib/server/backend';
import type { TokenResponse } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/app/dashboard');
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const alias = String(formData.get('alias') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!alias || !password) {
      return fail(400, {
        error: 'Completa alias y password para iniciar sesion.',
        values: { alias }
      });
    }

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
      return fail(response.status, {
        error: await readBackendError(response),
        values: { alias }
      });
    }

    const payload = (await response.json()) as TokenResponse;

    cookies.set('auth_token', payload.access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 60 * 30
    });

    throw redirect(303, '/app/dashboard');
  }
};
