<script lang="ts">
  import type { GeneradorPublic } from '$lib/types';
  import Sidebar from './Sidebar.svelte';

  export let user: GeneradorPublic;
</script>

<div class="h-screen overflow-hidden xl:flex">
  <Sidebar {user} />

  <main class="flex h-full min-h-0 flex-1 flex-col overflow-hidden xl:ml-64">
    <div class="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden px-3 py-3 sm:px-4 lg:px-5 xl:px-6">
      <slot />
    </div>
  </main>
</div>
