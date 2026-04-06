<script lang="ts">
  import type { ActionData } from './$types';
  import Button from '$lib/components/ui/Button.svelte';
  import Icon from '$lib/components/ui/Icon.svelte';

  export let form: ActionData;

  function isAuthMode(value: string | undefined): value is 'login' | 'register' {
    return value === 'login' || value === 'register';
  }

  let mode: 'login' | 'register' = form?.mode === 'register' ? 'register' : 'login';

  $: if (isAuthMode(form?.mode) && form.mode !== mode) {
    mode = form.mode;
  }
</script>

<svelte:head>
  <title>Login | Kiosk For Creators</title>
</svelte:head>

<div class="relative min-h-screen overflow-hidden px-6 py-10">
  <div class="pointer-events-none absolute inset-0">
    <div class="absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-sky-100/70 blur-3xl"></div>
    <div class="absolute bottom-0 left-0 h-[24rem] w-[24rem] rounded-full bg-slate-200/70 blur-3xl"></div>
  </div>

  <main class="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
    <section class="hidden space-y-8 lg:block">
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-sky-900/15">
            <Icon name="auto_awesome" filled className="text-3xl" />
          </div>
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Creative Studio</p>
            <h1 class="font-headline text-5xl font-extrabold tracking-tight text-slate-950">Kiosk For Creators</h1>
          </div>
        </div>

        <p class="max-w-xl text-lg leading-8 text-slate-600">
          Genera contenido visual en segundos para retail, eventos, hospitality y senaletica digital. Itera ideas con IA,
          afina el resultado y publica cada pieza en tus pantallas desde un solo lugar.
        </p>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <article class="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">
          <Icon name="neurology" className="mb-4 text-3xl text-primary" />
          <h2 class="font-headline text-lg font-bold text-slate-900">Creacion instantanea</h2>
          <p class="mt-3 text-sm leading-7 text-slate-600">
            Pasa de una idea a una visual lista para produccion con prompts, iteraciones y una vista clara del resultado.
          </p>
        </article>

        <article class="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">
          <Icon name="shield_with_heart" className="mb-4 text-3xl text-primary" />
          <h2 class="font-headline text-lg font-bold text-slate-900">Operacion profesional</h2>
          <p class="mt-3 text-sm leading-7 text-slate-600">
            Organiza conversaciones, revisa versiones y lleva cada pieza a la pantalla correcta con un flujo pensado para equipos.
          </p>
        </article>
      </div>
    </section>

    <section class="mx-auto w-full max-w-md">
      <div class="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-10">
        <div class={`pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full blur-3xl transition duration-500 ${
          mode === 'register' ? 'bg-emerald-100/80' : 'bg-sky-100/80'
        }`}></div>
        <div class="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent"></div>

        <div class="space-y-4">
          <div class="relative min-h-[8.75rem] overflow-hidden">
            <div
              class={`absolute inset-0 space-y-2 text-center transition duration-400 ease-out sm:text-left ${
                mode === 'login'
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-2 opacity-0'
              }`}
            >
              <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-primary">Iniciar sesion</p>
              <h2 class="font-headline text-3xl font-extrabold tracking-tight text-slate-900">
                Bienvenido de nuevo
              </h2>
              <p class="text-sm leading-7 text-slate-500">
                Entra a tu estudio creativo y continua generando piezas listas para publicar.
              </p>
            </div>

            <div
              class={`absolute inset-0 space-y-2 text-center transition duration-400 ease-out sm:text-left ${
                mode === 'register'
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-2 opacity-0'
              }`}
            >
              <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-primary">Crear cuenta</p>
              <h2 class="font-headline text-3xl font-extrabold tracking-tight text-slate-900">
                Activa tu estudio creativo
              </h2>
              <p class="text-sm leading-7 text-slate-500">
                Crea tu acceso para empezar a generar, iterar y publicar contenido visual con IA.
              </p>
            </div>
          </div>

          <div class="relative grid grid-cols-2 gap-2 rounded-[22px] border border-slate-200 bg-slate-50/85 p-1.5">
            <div
              class="pointer-events-none absolute inset-y-1.5 left-1.5 w-[calc(50%-0.5rem)] rounded-[18px] bg-white shadow-[0_12px_26px_rgba(15,23,42,0.08)] transition duration-300 ease-out"
              style={`transform: translateX(${mode === 'register' ? 'calc(100% + 0.5rem)' : '0'})`}
            ></div>

            <button
              type="button"
              class={`relative z-10 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
                mode === 'login'
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              on:click={() => (mode = 'login')}
            >
              Entrar
            </button>
            <button
              type="button"
              class={`relative z-10 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
                mode === 'register'
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              on:click={() => (mode = 'register')}
            >
              Registrarse
            </button>
          </div>
        </div>

        {#if form?.error}
          <div class="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {form.error}
          </div>
        {/if}

        <form method="POST" action={mode === 'register' ? '?/register' : '?/login'} class="mt-8 space-y-6">
          <div class="space-y-2">
            <label class="block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500" for="alias">
              Alias
            </label>
            <div class="relative">
              <Icon name="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="alias"
                name="alias"
                type="text"
                autocomplete="username"
                value={form?.values?.alias ?? ''}
                placeholder="studio_norte"
                class="w-full rounded-2xl border border-slate-200 bg-surface-container-high py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500" for="password">
              Contrasena
            </label>
            <div class="relative">
              <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                name="password"
                type="password"
                autocomplete={mode === 'register' ? 'new-password' : 'current-password'}
                placeholder={mode === 'register' ? 'Crea una contrasena' : 'Tu contrasena'}
                class="w-full rounded-2xl border border-slate-200 bg-surface-container-high py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          <div
            class={`grid overflow-hidden transition-all duration-400 ease-out ${
              mode === 'register'
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            }`}
            aria-hidden={mode !== 'register'}
          >
            <div class="min-h-0">
              <div class="space-y-2 pb-0.5">
                <label class="block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500" for="confirmPassword">
                  Confirmar contrasena
                </label>
                <div class="relative">
                  <Icon name="verified_user" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autocomplete="new-password"
                    placeholder="Repite tu contrasena"
                    disabled={mode !== 'register'}
                    class="w-full rounded-2xl border border-slate-200 bg-surface-container-high py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:pointer-events-none disabled:opacity-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full justify-center">
            {mode === 'register' ? 'Crear cuenta y entrar' : 'Entrar al panel'}
          </Button>
        </form>
      </div>
    </section>
  </main>
</div>
