<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { buildAssetUrl, conversationLabel } from '$lib/utils';
  import type { PageData } from './$types';

  export let data: PageData;

  $: featuredGeneration = data.recentImages[0];
  $: secondaryGenerations = data.recentImages.slice(1);
</script>

<svelte:head>
  <title>Dashboard | Kiosk For Creators</title>
</svelte:head>

<div class="relative flex h-full min-h-0 flex-col overflow-hidden bg-transparent">
  <div class="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_62%)]"></div>
  <div class="pointer-events-none absolute left-8 top-6 h-24 w-24 rounded-full bg-sky-100/45 blur-3xl"></div>
  <div class="pointer-events-none absolute right-16 top-8 h-28 w-28 rounded-full bg-cyan-100/35 blur-3xl"></div>

  <section class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div class="flex shrink-0 flex-wrap items-start justify-between gap-4 px-3 py-2">
      <div class="min-w-0 flex-1">
        <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Actividad reciente</p>
        <h2 class="mt-1 font-headline text-[1.7rem] font-extrabold tracking-tight text-slate-950">
          Exploracion visual reciente
        </h2>
        <p class="mt-1 max-w-4xl text-[12px] leading-5 text-slate-600">
          Revisa las ultimas piezas generadas, entiende el brief de origen y retoma rapidamente la sesion creativa adecuada.
        </p>
      </div>
      <a href="/app/create">
        <Button type="button" size="sm" icon="add_comment" className="min-h-9 rounded-full px-3.5 shadow-[0_14px_30px_rgba(3,105,161,0.22)]">
          Abrir chat
        </Button>
      </a>
    </div>

    {#if data.recentImages.length === 0}
      <div class="flex flex-1 items-center justify-center px-4 pb-4 text-center">
        <div class="max-w-xl rounded-[30px] border border-dashed border-slate-300 bg-white/72 p-10 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <p class="font-headline text-xl font-bold text-slate-900">Todavia no hay imagenes generadas</p>
          <p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Tus ultimas piezas aprobadas apareceran aqui para que puedas revisar el ritmo creativo y volver a las mejores ideas.
          </p>
        </div>
      </div>
    {:else}
      <div class="min-h-0 flex-1 overflow-hidden px-3 pb-3">
        <div class={`grid h-full min-h-0 gap-3 ${secondaryGenerations.length > 0 ? 'xl:grid-cols-[minmax(0,1.72fr)_360px]' : ''}`}>
        <a
          href={`/app/create?conversation=${featuredGeneration.conversationId}`}
          class="group min-h-0 overflow-hidden rounded-[30px] border border-white/70 bg-slate-950 shadow-[0_18px_42px_rgba(15,23,42,0.12)] transition hover:shadow-[0_24px_54px_rgba(15,23,42,0.16)]"
        >
          <div class="relative h-full min-h-[15rem] sm:min-h-[18rem] xl:min-h-0">
            <img
              src={buildAssetUrl(data.apiBaseUrl, featuredGeneration.content)}
              alt={`Imagen destacada de ${conversationLabel(featuredGeneration.conversationId)}`}
              class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/54 to-slate-950/10"></div>
            <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent"></div>
            <div class="relative flex h-full flex-col justify-end p-5 sm:p-6">
              <div class="flex flex-wrap gap-2">
                <span class="inline-flex items-center rounded-full border border-white/12 bg-slate-950/74 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_12px_32px_rgba(15,23,42,0.45)] backdrop-blur-md ring-1 ring-black/10">
                  Generacion destacada
                </span>
                <span class="inline-flex items-center rounded-full border border-white/12 bg-slate-950/74 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_12px_32px_rgba(15,23,42,0.45)] backdrop-blur-md ring-1 ring-black/10">
                  Variacion {featuredGeneration.variantNumber} de {featuredGeneration.totalVariants}
                </span>
              </div>

              <div class="mt-3">
                <span class="inline-flex items-center rounded-full border border-white/12 bg-slate-950/68 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-sky-100 shadow-[0_12px_32px_rgba(15,23,42,0.4)] backdrop-blur-md ring-1 ring-black/10">
                  {conversationLabel(featuredGeneration.conversationId)}
                </span>
              </div>
              <h3 class="mt-2 max-w-2xl font-headline text-[1.55rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[1.9rem]">
                {featuredGeneration.prompt}
              </h3>

              <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-white/78">
                <span>{featuredGeneration.messageCount} intercambios en la sesion</span>
                <span>
                  {featuredGeneration.isLatestInConversation ? 'Version actual del flujo creativo' : 'Version previa conservada'}
                </span>
              </div>
            </div>
          </div>
        </a>

        {#if secondaryGenerations.length > 0}
          <div class="grid min-h-0 auto-rows-[minmax(0,1fr)] gap-3">
            {#each secondaryGenerations as image}
              <a
                href={`/app/create?conversation=${image.conversationId}`}
                class="group min-h-0 overflow-hidden rounded-[26px] border border-white/70 bg-slate-950 shadow-[0_16px_40px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(15,23,42,0.16)]"
              >
                <div class="relative h-full min-h-[10.5rem]">
                  <img
                    src={buildAssetUrl(data.apiBaseUrl, image.content)}
                    alt={`Imagen de ${conversationLabel(image.conversationId)}`}
                    class="absolute inset-0 h-full w-full scale-[1.02] object-cover object-center transition duration-500 group-hover:scale-[1.05]"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/86 via-slate-950/20 to-slate-950/0"></div>
                  <div class="absolute inset-x-2.5 bottom-2.5 overflow-hidden rounded-[14px] border border-white/12 bg-slate-950/66 shadow-[0_14px_32px_rgba(15,23,42,0.34)] backdrop-blur-xl ring-1 ring-black/10">
                    <div class="dashboard-marquee-track flex w-max items-center gap-8 px-3.5 py-2.5">
                      <span class="dashboard-marquee-text">{image.prompt}</span>
                      <span aria-hidden="true" class="dashboard-marquee-text">{image.prompt}</span>
                    </div>
                  </div>
                </div>
              </a>
            {/each}
          </div>
        {/if}
        </div>
      </div>
    {/if}
  </section>
</div>

<style>
  @keyframes dashboard-marquee {
    from {
      transform: translateX(0);
    }

    to {
      transform: translateX(-50%);
    }
  }

  .dashboard-marquee-track {
    min-width: 200%;
    animation: dashboard-marquee 18s linear infinite;
  }

  .dashboard-marquee-text {
    white-space: nowrap;
    font-family: var(--font-headline);
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.01em;
    color: rgba(255, 255, 255, 0.96);
  }
</style>
