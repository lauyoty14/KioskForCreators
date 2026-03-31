<script lang="ts">
  import Icon from './Icon.svelte';

  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let icon: string | null = null;
  export let className = '';
  export let disabled = false;

  const variants = {
    primary:
      'border border-sky-700/10 bg-[linear-gradient(180deg,#0b78b7_0%,#0369a1_100%)] text-white shadow-[0_14px_30px_rgba(3,105,161,0.22)] hover:-translate-y-[1px] hover:brightness-[1.03] hover:shadow-[0_18px_38px_rgba(3,105,161,0.28)]',
    secondary:
      'border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(241,245,249,0.92)_100%)] text-slate-700 shadow-sm hover:-translate-y-[1px] hover:border-slate-300 hover:bg-white hover:shadow-md',
    ghost:
      'border border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm'
  };

  const sizes = {
    sm: 'min-h-10 px-4 text-[11px] uppercase tracking-[0.2em]',
    md: 'min-h-11 px-5 text-sm',
    lg: 'min-h-12 px-6 text-base'
  };
</script>

<button
  {type}
  {disabled}
  class={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
>
  {#if icon}
    <Icon name={icon} className={size === 'sm' ? 'text-base' : 'text-lg'} />
  {/if}
  <slot />
</button>
