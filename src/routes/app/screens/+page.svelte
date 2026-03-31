<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { buildAssetUrl, formatDate } from '$lib/utils';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let showLibrary = Boolean(form?.carouselError);

  function isAssignedToSelectedScreen(imageUrl: string): boolean {
    return data.selectedScreenContents.some((content) => content.url === imageUrl);
  }

  function screenHref(screenId: number): string {
    return `/app/screens?screen=${screenId}`;
  }

  function manageHref(screenId: number): string {
    return `/app/screens?screen=${screenId}&manage=1`;
  }

  function openLibrary() {
    showLibrary = true;
  }

  function closeLibrary() {
    showLibrary = false;
  }
</script>

<svelte:head>
  <title>Mis Pantallas | Kiosk For Creators</title>
</svelte:head>

<div class="flex h-full min-h-0 flex-col gap-4">
  {#if data.manageMode && data.selectedScreen}
    <section class="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[26px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,250,252,0.94)_100%)] p-3.5 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
      <div class="pointer-events-none absolute right-12 top-6 h-24 w-24 rounded-full bg-sky-100/45 blur-3xl"></div>

      <div class="relative z-[1] flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/70 pb-2.5">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-3">
            <a
              href={screenHref(data.selectedScreen.id)}
              class="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
              aria-label="Volver a pantallas"
            >
              <Icon name="arrow_back" className="text-[0.95rem]" />
            </a>
            <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Pantalla activa</p>
          </div>

          <h2 class="mt-1.5 font-headline text-[1.42rem] font-extrabold tracking-tight text-slate-900">
            Carrusel de {data.selectedScreen.alias}
          </h2>
          <p class="mt-0.5 text-[12px] leading-5 text-slate-600">
            Revisa lo que ya esta en reproduccion y abre la biblioteca solo cuando quieras sumar una nueva pieza.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div class="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
            Pantalla #{data.selectedScreen.id}
          </div>
          <button
            type="button"
            class="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-sky-700/10 bg-[linear-gradient(180deg,#0b78b7_0%,#0369a1_100%)] px-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_30px_rgba(3,105,161,0.22)] transition duration-200 hover:-translate-y-[1px] hover:brightness-[1.03] hover:shadow-[0_18px_38px_rgba(3,105,161,0.28)]"
            on:click={openLibrary}
          >
            <Icon name="add_photo_alternate" className="text-[0.95rem]" />
            <span>Anadir imagen</span>
          </button>
        </div>
      </div>

      {#if data.carouselUpdated}
        <div class="mt-3 rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          La nueva pieza se agrego al carrusel correctamente.
        </div>
      {/if}

      {#if data.carouselRemoved}
        <div class="mt-3 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          La pieza se quito del carrusel.
        </div>
      {/if}

      {#if form?.carouselError}
        <div class="mt-3 rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
          {form.carouselError}
        </div>
      {/if}

      <div class="mt-2.5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/92 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
        <div class="flex items-center justify-between gap-3 border-b border-slate-200/70 px-3.5 py-2.5">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Actual en pantalla</p>
            <h3 class="mt-1 font-headline text-[1rem] font-bold tracking-tight text-slate-900">
              Piezas dentro del carrusel
            </h3>
          </div>
          <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {data.selectedScreenContents.length}
          </span>
        </div>

        {#if data.selectedScreenContents.length === 0}
          <div class="flex min-h-0 flex-1 items-center justify-center p-5">
            <div class="max-w-lg rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-8 text-center">
              <p class="font-headline text-xl font-bold text-slate-900">Todavia no hay piezas en este carrusel</p>
              <p class="mt-3 text-sm leading-6 text-slate-600">
                Usa el boton <span class="font-semibold text-slate-900">Anadir imagen</span> para abrir la biblioteca y publicar la primera pieza en esta pantalla.
              </p>
            </div>
          </div>
        {:else}
          <div class="min-h-0 flex-1 overflow-hidden px-3 py-3">
            <div class="grid auto-rows-min gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {#each data.selectedScreenContents as content}
                <article class="overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <div class="relative aspect-[5/4] overflow-hidden bg-slate-100">
                    <img
                      src={buildAssetUrl(data.apiBaseUrl, content.url)}
                      alt={`Contenido ${content.id}`}
                      class="h-full w-full object-cover"
                    />

                    <form method="POST" action="?/removeFromCarousel" class="absolute right-2.5 top-2.5">
                      <input type="hidden" name="screenId" value={data.selectedScreen.id} />
                      <input type="hidden" name="contentId" value={content.id} />
                      <button
                        type="submit"
                        class="group inline-flex h-10 w-10 items-center justify-center rounded-bl-[18px] border-b border-l border-white/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.82)_0%,rgba(30,41,59,0.70)_100%)] text-white shadow-[0_12px_24px_rgba(15,23,42,0.24)] backdrop-blur-xl transition duration-200 hover:bg-[linear-gradient(180deg,#fb7185_0%,#e11d48_100%)] hover:text-white"
                        aria-label={`Quitar pieza ${content.id} del carrusel`}
                      >
                        <span class="absolute inset-0 rounded-bl-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_100%)] opacity-70 transition group-hover:opacity-0"></span>
                        <Icon name="close" className="relative text-[0.95rem]" />
                      </button>
                    </form>
                  </div>

                  <div class="space-y-1.5 px-3 py-3">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">En reproduccion</p>
                        <p class="mt-0.5 text-[13px] font-semibold text-slate-900">Pieza #{content.id}</p>
                        <p class="mt-0.5 text-[11px] leading-4 text-slate-500">{formatDate(content.fecha_creacion)}</p>
                      </div>

                      <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                        Activa
                      </span>
                    </div>
                  </div>
                </article>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      {#if showLibrary}
        <button
          type="button"
          class="absolute inset-0 z-20 bg-slate-950/18 backdrop-blur-[3px]"
          aria-label="Cerrar biblioteca"
          on:click={closeLibrary}
        ></button>

        <aside class="absolute inset-y-4 right-4 z-30 flex w-full max-w-[470px] flex-col overflow-hidden rounded-[28px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(247,250,252,0.97)_100%)] shadow-[-18px_0_50px_rgba(15,23,42,0.16)] backdrop-blur-xl">
          <div class="flex items-start justify-between gap-4 border-b border-slate-200/70 px-4 py-4">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Biblioteca reciente</p>
              <h3 class="mt-1.5 font-headline text-[1.18rem] font-bold tracking-tight text-slate-900">
                Anadir nueva imagen
              </h3>
              <p class="mt-1.5 text-[13px] leading-6 text-slate-600">
                Elige una pieza generada recientemente para sumarla al carrusel de esta pantalla.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
              aria-label="Cerrar biblioteca"
              on:click={closeLibrary}
            >
              <Icon name="close" className="text-[1rem]" />
            </button>
          </div>

          {#if data.carouselLibrary.length === 0}
            <div class="flex flex-1 items-center justify-center p-5">
              <div class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-6 text-center text-sm leading-6 text-slate-600">
                Aun no hay imagenes generadas para reutilizar desde aqui.
              </div>
            </div>
          {:else}
            <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div class="space-y-3">
                {#each data.carouselLibrary as asset}
                  <article class="rounded-[22px] border border-slate-200/80 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                    <div class="grid gap-3 grid-cols-[104px_minmax(0,1fr)]">
                      <div class="overflow-hidden rounded-[18px] bg-slate-100">
                        <img
                          src={buildAssetUrl(data.apiBaseUrl, asset.imageUrl)}
                          alt={asset.prompt}
                          class="h-[96px] w-full object-cover"
                        />
                      </div>

                      <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            {asset.conversationName}
                          </span>
                          <span class="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                            {asset.variationLabel}
                          </span>
                        </div>

                        <p class="mt-2 line-clamp-2 text-[14px] font-semibold leading-5 text-slate-900">{asset.prompt}</p>

                        <form method="POST" action="?/addToCarousel" class="mt-3">
                          <input type="hidden" name="screenId" value={data.selectedScreen.id} />
                          <input type="hidden" name="imageUrl" value={asset.imageUrl} />
                          <Button
                            type="submit"
                            size="sm"
                            icon={isAssignedToSelectedScreen(asset.imageUrl) ? 'check' : 'add_photo_alternate'}
                            className="w-full justify-center text-[12px]"
                            disabled={isAssignedToSelectedScreen(asset.imageUrl)}
                          >
                            {#if isAssignedToSelectedScreen(asset.imageUrl)}
                              Ya esta en el carrusel
                            {:else}
                              Agregar al carrusel
                            {/if}
                          </Button>
                        </form>
                      </div>
                    </div>
                  </article>
                {/each}
              </div>
            </div>
          {/if}
        </aside>
      {/if}
    </section>
  {:else}
    <div class="grid min-h-0 flex-1 gap-4 xl:grid-cols-[290px_minmax(0,1fr)]">
      <section class="rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.94)_100%)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Vinculacion</p>
        <h2 class="mt-2 font-headline text-[1.5rem] font-extrabold tracking-tight text-slate-900">Conectar pantalla</h2>
        <p class="mt-2 text-[13px] leading-6 text-slate-600">
          Vincula un dispositivo nuevo con su codigo para sumarlo a tu red de reproduccion.
        </p>

        {#if data.linked}
          <div class="mt-4 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Pantalla vinculada correctamente.
          </div>
        {/if}

        {#if form?.linkError}
          <div class="mt-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {form.linkError}
          </div>
        {/if}

        <form method="POST" action="?/link" class="mt-5 space-y-3.5">
          <div class="space-y-2">
            <label for="code" class="block text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Codigo de vinculacion
            </label>
            <div class="relative">
              <Icon name="password" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="code"
                name="code"
                type="text"
                placeholder="ABC123XYZ"
                class="w-full rounded-[22px] border border-slate-200 bg-surface-container-high py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          <Button type="submit" icon="link" className="w-full justify-center">Vincular pantalla</Button>
        </form>

        <div class="mt-5 rounded-[24px] border border-slate-200/80 bg-slate-50/85 p-4">
          <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Resultado</p>
          <ul class="mt-3 space-y-2.5 text-[13px] leading-6 text-slate-600">
            <li class="flex gap-2">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500"></span>
              La pantalla aparecera en tu inventario apenas quede vinculada.
            </li>
            <li class="flex gap-2">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Luego podras abrir la gestion del carrusel desde la pantalla seleccionada.
            </li>
          </ul>
        </div>
      </section>

      <section class="flex min-h-0 flex-col rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.94)_100%)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Inventario</p>
            <h2 class="mt-2 font-headline text-[1.5rem] font-extrabold tracking-tight text-slate-900">Pantallas vinculadas</h2>
          </div>

          <div class="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
            {data.screens.length} activas
          </div>
        </div>

        <p class="mt-2 text-[13px] leading-6 text-slate-600">
          Selecciona una pantalla y abre su gestion cuando quieras editar el carrusel.
        </p>

        {#if data.screens.length === 0}
          <div class="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-8 text-center">
            <p class="font-headline text-lg font-bold text-slate-900">Todavia no hay pantallas vinculadas</p>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Usa el bloque de vinculacion para conectar la primera.
            </p>
          </div>
        {:else}
          <div class="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {#each data.screens as screen}
              <article
                class={`rounded-[24px] border px-4 py-4 transition ${
                  data.selectedScreenId === screen.id
                    ? 'border-sky-200 bg-[linear-gradient(180deg,rgba(240,249,255,0.98)_0%,rgba(224,242,254,0.84)_100%)] shadow-[0_16px_36px_rgba(14,116,144,0.12)]'
                    : 'border-slate-200/80 bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.05)]'
                }`}
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex min-w-0 items-center gap-3">
                    <span class={`inline-flex h-11 w-11 items-center justify-center rounded-[18px] ${
                      data.selectedScreenId === screen.id ? 'bg-sky-100 text-primary' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Icon name="desktop_windows" className="text-[1.1rem]" />
                    </span>

                    <div class="min-w-0">
                      <p class="truncate text-[15px] font-semibold text-slate-900">{screen.alias}</p>
                      <div class="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>Pantalla #{screen.id}</span>
                        <span class="rounded-full bg-white/85 px-2 py-0.5 font-semibold text-slate-500">
                          Generador #{screen.generador_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span class={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                    data.selectedScreenId === screen.id ? 'bg-white/85 text-primary' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {data.selectedScreenId === screen.id ? 'Seleccionada' : 'Disponible'}
                  </span>
                </div>

                <div class="mt-3 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-3 text-[11px]">
                  <span class="rounded-full bg-white/85 px-2.5 py-1 font-semibold text-slate-600">
                    {data.screenContentCounts[screen.id] ?? 0} piezas en carrusel
                  </span>

                  <div class="flex items-center gap-2">
                    {#if data.selectedScreenId !== screen.id}
                      <a
                        href={screenHref(screen.id)}
                        class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                      >
                        Seleccionar
                      </a>
                    {/if}

                    <a
                      href={manageHref(screen.id)}
                      class={`inline-flex items-center gap-1 rounded-full px-3 py-2 font-semibold transition ${
                        data.selectedScreenId === screen.id
                          ? 'bg-primary text-white shadow-[0_12px_24px_rgba(3,105,161,0.22)] hover:brightness-[1.03]'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      Ver gestion
                      <Icon name="arrow_outward" className="text-[0.9rem]" />
                    </a>
                  </div>
                </div>
              </article>
            {/each}
          </div>
        {/if}
      </section>
    </div>
  {/if}
</div>
