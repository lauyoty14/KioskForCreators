<script lang="ts">
  import { page } from '$app/stores';
  import type { GeneradorPublic } from '$lib/types';
  import Button from '$lib/components/ui/Button.svelte';
  import Icon from '$lib/components/ui/Icon.svelte';

  export let user: GeneradorPublic;

  const navItems = [
    { href: '/app/dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { href: '/app/create', label: 'Crear Contenido', icon: 'add_comment' },
    { href: '/app/screens', label: 'Mis Pantallas', icon: 'tv' }
  ];

  function isActive(href: string): boolean {
    return $page.url.pathname === href;
  }
</script>

<aside class="overflow-y-auto border-b border-white/70 bg-white/75 backdrop-blur-xl xl:fixed xl:inset-y-0 xl:left-0 xl:h-screen xl:w-64 xl:border-b-0 xl:border-r">
  <div class="flex h-full flex-col gap-5 p-4 sm:p-5">
    <div class="flex items-center gap-3 px-1">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-sky-900/15">
        <Icon name="auto_awesome" filled className="text-[1.35rem]" />
      </div>
      <div>
        <p class="font-headline text-lg font-extrabold tracking-tight text-slate-900">Kiosk AI</p>
        <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Creative Studio</p>
      </div>
    </div>

    <nav class="grid grid-cols-1 gap-1.5 sm:grid-cols-3 xl:grid-cols-1">
      {#each navItems as item}
        <a
          href={item.href}
          class={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition ${
            isActive(item.href)
              ? 'bg-sky-50 text-primary ring-1 ring-sky-100'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Icon name={item.icon} className="text-lg" />
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>

    <div class="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50/85 p-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-base font-bold text-slate-700">
          {user.alias.slice(0, 1).toUpperCase()}
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-slate-900">{user.alias}</p>
          <p class="text-[11px] text-slate-500">Generador #{user.id}</p>
        </div>
      </div>

      <div class="rounded-2xl bg-white p-3.5 ring-1 ring-slate-200">
        <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Centro creativo</p>
        <p class="mt-2 text-[13px] leading-6 text-slate-600">
          Crea piezas con rapidez, mantén el contexto de cada campaña y publica versiones listas para tus espacios.
        </p>
      </div>

      <form method="POST" action="/logout">
        <Button variant="ghost" size="sm" icon="logout" className="w-full justify-center">
          Cerrar sesion
        </Button>
      </form>
    </div>
  </div>
</aside>
