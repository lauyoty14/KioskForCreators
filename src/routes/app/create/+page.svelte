<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { buildAssetUrl, conversationLabel, conversationPreview, isStaticAsset } from '$lib/utils';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let activePanel: 'history' | 'screens' | null = null;
  let initializedPanel = false;

  function firstPrompt(conversationId: number): string {
    const conversation = data.conversations.find((entry) => entry.id === conversationId);
    return conversationPreview(conversation?.mensajes.find((message) => message.role === 'user')?.content);
  }

  function generatedVersions(conversationId: number): number {
    const conversation = data.conversations.find((entry) => entry.id === conversationId);
    return (
      conversation?.mensajes.filter(
        (message) => message.role === 'assistant' && isStaticAsset(message.content)
      ).length ?? 0
    );
  }

  function togglePanel(panel: 'history' | 'screens') {
    activePanel = activePanel === panel ? null : panel;
  }

  function closePanels() {
    activePanel = null;
  }

  $: if (!initializedPanel && (form?.assignError || data.justAssigned)) {
    activePanel = 'screens';
    initializedPanel = true;
  } else if (!initializedPanel && !data.selectedConversation) {
    activePanel = 'history';
    initializedPanel = true;
  } else if (!initializedPanel) {
    initializedPanel = true;
  }
</script>

<svelte:head>
  <title>Laboratorio Creativo | Kiosk For Creators</title>
</svelte:head>

<section class="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-transparent">
  <div class="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_62%)]"></div>
  <div class="pointer-events-none absolute right-12 top-10 h-28 w-28 rounded-full bg-sky-100/45 blur-3xl"></div>

  <div class="px-4 py-2.5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="min-w-0">
        <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-primary/80">Workspace IA</p>
        <h2 class="mt-1 font-headline text-[1.35rem] font-extrabold tracking-tight text-slate-900">Laboratorio Creativo</h2>
      </div>

      <div class="flex flex-wrap items-center justify-end gap-2 rounded-full border border-white/80 bg-white/76 px-2.5 py-2 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <button
          type="button"
          aria-pressed={activePanel === 'history'}
          class={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition ${
            activePanel === 'history'
              ? 'border-sky-200 bg-[linear-gradient(180deg,rgba(240,249,255,0.98)_0%,rgba(224,242,254,0.94)_100%)] text-primary shadow-[0_10px_24px_rgba(14,116,144,0.14)]'
              : 'border-white/80 bg-white/80 text-slate-700 hover:border-slate-200 hover:bg-white hover:shadow-sm'
          }`}
          on:click={() => togglePanel('history')}
        >
          <span class={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
            activePanel === 'history' ? 'bg-sky-100 text-primary' : 'bg-slate-100 text-slate-500'
          }`}>
            <Icon name="history" className="text-[0.95rem]" />
          </span>
          <span>Historial</span>
          <span class={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
            activePanel === 'history' ? 'bg-sky-100 text-primary/80' : 'bg-slate-100 text-slate-500'
          }`}>
            {data.conversations.length}
          </span>
        </button>

        <button
          type="button"
          aria-pressed={activePanel === 'screens'}
          class={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition ${
            activePanel === 'screens'
              ? 'border-sky-200 bg-[linear-gradient(180deg,rgba(240,249,255,0.98)_0%,rgba(224,242,254,0.94)_100%)] text-primary shadow-[0_10px_24px_rgba(14,116,144,0.14)]'
              : 'border-white/80 bg-white/80 text-slate-700 hover:border-slate-200 hover:bg-white hover:shadow-sm'
          }`}
          on:click={() => togglePanel('screens')}
        >
          <span class={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
            activePanel === 'screens' ? 'bg-sky-100 text-primary' : 'bg-slate-100 text-slate-500'
          }`}>
            <Icon name="display_settings" className="text-[0.95rem]" />
          </span>
          <span>Pantallas</span>
          <span class={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
            activePanel === 'screens' ? 'bg-sky-100 text-primary/80' : 'bg-slate-100 text-slate-500'
          }`}>
            {data.screens.length}
          </span>
        </button>

        <form method="POST" action="?/start">
          <Button
            type="submit"
            size="sm"
            icon="add"
            className="min-h-9 rounded-full px-3.5 text-[13px] shadow-md shadow-sky-900/10"
          >
            Nueva sesion
          </Button>
        </form>
      </div>
    </div>
  </div>

  <div class="flex min-h-0 flex-1 flex-col bg-[radial-gradient(circle_at_top,rgba(186,230,253,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(248,250,252,0.6)_100%)]">
    <div class="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {#if activePanel}
        <button
          type="button"
          class="absolute inset-0 z-10 bg-slate-950/12 backdrop-blur-[3px]"
          aria-label="Cerrar panel"
          on:click={closePanels}
        ></button>
      {/if}

      <aside
        class={`absolute inset-y-0 left-0 z-20 w-full max-w-[352px] border-r border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(246,249,252,0.96)_100%)] shadow-[24px_0_60px_rgba(15,23,42,0.12)] backdrop-blur-xl transition duration-300 ${
          activePanel === 'history' ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        <div class="flex h-full flex-col">
          <div class="border-b border-slate-200/70 px-4 py-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Historial</p>
                <h3 class="mt-1 font-headline text-[1.4rem] font-bold tracking-tight text-slate-900">Sesiones creativas</h3>
              </div>

              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-800"
                aria-label="Cerrar historial"
                on:click={closePanels}
              >
                <Icon name="close" className="text-[1.05rem]" />
              </button>
            </div>
          </div>

          <div class="flex-1 space-y-3 overflow-y-auto overscroll-contain px-3.5 py-3.5">
            {#if data.conversations.length === 0}
              <div class="rounded-[24px] border border-dashed border-slate-300 bg-white/85 px-4 py-5 text-sm leading-7 text-slate-600">
                Aun no hay sesiones guardadas. Crea una nueva para empezar tu primera exploracion.
              </div>
            {:else}
              {#each data.conversations as conversation}
                <a
                  href={`/app/create?conversation=${conversation.id}`}
                  class={`group block rounded-[24px] border px-3.5 py-3.5 transition ${
                    data.selectedConversationId === conversation.id
                      ? 'border-sky-200 bg-[linear-gradient(180deg,rgba(240,249,255,0.98)_0%,rgba(224,242,254,0.86)_100%)] text-slate-900 shadow-[0_18px_38px_rgba(14,116,144,0.12)]'
                      : 'border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)] text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]'
                  }`}
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="space-y-2">
                      <div class="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
                        data.selectedConversationId === conversation.id
                          ? 'border-sky-200 bg-white/80 text-primary'
                          : 'border-slate-200 bg-slate-50 text-slate-500'
                      }">
                        <span class={`h-1.5 w-1.5 rounded-full ${
                          data.selectedConversationId === conversation.id ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}></span>
                        {data.selectedConversationId === conversation.id ? 'Sesion activa' : 'Disponible'}
                      </div>
                      <p class="font-headline text-[1.05rem] font-bold tracking-tight text-slate-900">
                        {conversationLabel(conversation.id)}
                      </p>
                    </div>

                    <div class="rounded-[16px] border border-white/80 bg-white/80 px-2.5 py-2 text-right shadow-sm">
                      <p class="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Intercambios</p>
                      <p class="mt-1 font-headline text-[1rem] font-bold tracking-tight text-slate-900">
                        {conversation.mensajes.length}
                      </p>
                    </div>
                  </div>

                  <p class="mt-2.5 text-[12px] leading-6 text-slate-600">
                    {firstPrompt(conversation.id)}
                  </p>

                  <div class="mt-3 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-2.5 text-[10px]">
                    <div class="flex flex-wrap items-center gap-2 text-slate-500">
                      <span class="rounded-full bg-white/80 px-2.5 py-1 font-semibold">
                        {generatedVersions(conversation.id)} versiones
                      </span>
                      <span class="rounded-full bg-white/80 px-2.5 py-1 font-semibold">
                        Flujo guardado
                      </span>
                    </div>

                    <span class="inline-flex items-center gap-1 font-semibold text-primary transition group-hover:translate-x-0.5">
                      Abrir
                      <Icon name="arrow_outward" className="text-[0.95rem]" />
                    </span>
                  </div>
                </a>
              {/each}
            {/if}
          </div>
        </div>
      </aside>

      <aside
        class={`absolute inset-y-0 right-0 z-20 w-full max-w-[392px] border-l border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(246,249,252,0.96)_100%)] shadow-[-24px_0_60px_rgba(15,23,42,0.12)] backdrop-blur-xl transition duration-300 ${
          activePanel === 'screens' ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        <div class="flex h-full flex-col">
          <div class="px-3.5 pb-2 pt-3.5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Pantallas</p>
                <h3 class="mt-1 font-headline text-[1.3rem] font-bold tracking-tight text-slate-900">Preview y asignacion</h3>
              </div>

              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-800"
                aria-label="Cerrar panel de pantallas"
                on:click={closePanels}
              >
                <Icon name="close" className="text-[1.05rem]" />
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-hidden px-3.5 pb-3 pt-2">
            <div class="flex h-full flex-col gap-2">
              {#if data.justAssigned}
                <div class="shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                  Contenido asignado correctamente.
                </div>
              {/if}

              {#if form?.assignError}
                <div class="shrink-0 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
                  {form.assignError}
                </div>
              {/if}

              <div class="shrink-0 overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_18px_34px_rgba(15,23,42,0.09)]">
                {#if data.latestGeneratedImage}
                  <div class="relative h-[176px] bg-slate-100">
                    <img
                      src={buildAssetUrl(data.apiBaseUrl, data.latestGeneratedImage.content)}
                      alt="Ultima generacion"
                      class="h-full w-full object-cover"
                    />

                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/78 via-slate-900/28 to-transparent px-3.5 pb-3 pt-10">
                      <span class="rounded-full border border-white/18 bg-slate-950/38 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur">
                        Nueva imagen lista
                      </span>
                    </div>
                  </div>
                {:else}
                  <div class="flex h-[176px] items-center justify-center bg-[linear-gradient(180deg,rgba(226,232,240,0.55)_0%,rgba(248,250,252,0.8)_100%)] px-6 text-center">
                    <div>
                      <p class="font-headline text-lg font-bold text-slate-900">Sin preview aun</p>
                      <p class="mt-2 text-[13px] leading-6 text-slate-600">
                        La primera imagen generada aparecera aqui para que la publiques cuando este lista.
                      </p>
                    </div>
                  </div>
                {/if}
              </div>

              <form method="POST" action="?/assign" class="flex min-h-0 flex-1 flex-col">
                <input type="hidden" name="conversationId" value={data.selectedConversationId || ''} />
                <input type="hidden" name="imageUrl" value={data.latestGeneratedImage?.content || ''} />

                <div class="flex min-h-0 flex-1 flex-col rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.94)_100%)] p-3 shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Asignar al carrusel</p>
                      <p class="mt-1 text-[12px] leading-5 text-slate-600">
                        Elige en que pantalla quieres mostrar esta nueva imagen dentro del carrusel activo.
                      </p>
                    </div>
                  </div>

                  {#if data.screens.length === 0}
                    <div class="mt-3 flex-1 rounded-[20px] border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-600">
                      Antes de publicar, vincula al menos una pantalla desde la seccion correspondiente.
                    </div>
                  {:else}
                    <div class="mt-2.5 space-y-2">
                      {#each data.screens as screen}
                        <label class="group flex cursor-pointer items-center justify-between gap-3 rounded-[20px] border border-slate-200/75 bg-white/88 px-3.5 py-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
                          <div class="flex min-w-0 items-center gap-3">
                            <span class="inline-flex h-9 w-9 items-center justify-center rounded-[14px] bg-sky-50 text-primary">
                              <Icon name="desktop_windows" className="text-[0.95rem]" />
                            </span>

                            <div class="min-w-0">
                              <p class="truncate text-[15px] font-semibold text-slate-900">{screen.alias}</p>
                              <p class="mt-0.5 text-[11px] text-slate-500">Pantalla #{screen.id}</p>
                            </div>
                          </div>

                          <input
                            type="checkbox"
                            name="screenIds"
                            value={screen.id}
                            class="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary"
                          />
                        </label>
                      {/each}
                    </div>
                  {/if}

                  <Button
                    type="submit"
                    icon="rocket_launch"
                    size="sm"
                    className="mt-auto w-full justify-center text-[12px]"
                    disabled={data.screens.length === 0 || !data.latestGeneratedImage}
                  >
                    Asignar nueva imagen al carrusel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <div class="flex-1 overflow-y-auto overscroll-contain px-4 py-2 pb-36">
        {#if data.selectedConversation}
          <div class="mx-auto w-full max-w-[780px] space-y-3.5">
            {#each data.selectedConversation.mensajes as message}
              <article class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div class={`max-w-[90%] space-y-1.5 sm:max-w-[72%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    <Icon
                      name={message.role === 'user' ? 'person' : 'auto_awesome'}
                      filled={message.role !== 'user'}
                      className="text-[1rem]"
                    />
                    <span>{message.role === 'user' ? 'Tu prompt' : 'Respuesta del asistente'}</span>
                  </div>

                  <div
                    class={`rounded-[24px] px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'border border-sky-700/10 bg-[linear-gradient(180deg,#0c76b4_0%,#0369a1_100%)] text-white shadow-[0_18px_40px_rgba(3,105,161,0.18)]'
                        : 'border border-white/80 bg-white/92 text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.05)]'
                    }`}
                  >
                    {#if isStaticAsset(message.content)}
                      <div class="overflow-hidden rounded-[22px] bg-slate-100">
                        <img
                          src={buildAssetUrl(data.apiBaseUrl, message.content)}
                          alt={`Contenido generado ${message.id}`}
                          class="max-h-[13rem] w-full object-cover"
                        />
                      </div>
                      <p class="mt-2 text-[12px] leading-5">
                        Version generada lista para revisar, iterar y asignar desde el panel de pantallas.
                      </p>
                    {:else}
                      <p class="text-[12px] leading-5">{message.content}</p>
                    {/if}
                  </div>
                </div>
              </article>
            {/each}
          </div>
        {:else}
          <div class="flex h-full min-h-[18rem] flex-col items-center justify-center px-8 text-center">
            <div class="max-w-2xl rounded-[30px] border border-dashed border-slate-300 bg-white/78 px-8 py-8 shadow-sm">
              <p class="font-headline text-[1.9rem] font-bold text-slate-900">Empieza una nueva conversacion</p>
              <p class="mt-3 text-sm leading-6 text-slate-600">
                Usa el boton de nueva sesion o abre el historial para recuperar una linea creativa anterior.
              </p>
            </div>
          </div>
        {/if}
      </div>

      <div class="pointer-events-none absolute inset-x-0 bottom-0 z-[5] px-4 pb-4">
        <div class="mx-auto w-full max-w-[760px]">
          {#if form?.sendError}
            <div class="pointer-events-auto mb-3 rounded-2xl border border-rose-200 bg-rose-50/95 px-4 py-3 text-sm text-rose-700 shadow-sm backdrop-blur">
              {form.sendError}
            </div>
          {/if}

          <form method="POST" action="?/send" class="pointer-events-auto">
            <input type="hidden" name="conversationId" value={data.selectedConversationId || ''} />
            <div class="rounded-[24px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(248,250,252,0.92)_100%)] p-2 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl transition focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-100">
              <textarea
                id="prompt"
                name="prompt"
                rows="1"
                placeholder="Escribe un prompt para generar una nueva pieza visual..."
                class="min-h-[2.85rem] w-full resize-none bg-transparent px-3 py-1.5 text-[13px] leading-5 text-slate-900 outline-none"
              ></textarea>
              <div class="flex items-center justify-end px-2 pb-1 pt-0">
                <Button type="submit" size="sm" icon="send">Enviar prompt</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
