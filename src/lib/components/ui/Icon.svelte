<script lang="ts">
  export let name: string;
  export let className = '';
  export let filled = false;
</script>

<span class={`material-symbols-outlined ${filled ? 'icon-filled' : ''} ${className}`}>
  {name}
</span>
