<script lang="ts">
    import { prefsStore } from '../lib/preferencesStore';
    
    let { children, hiring } = $props<{
        children: import('svelte').Snippet;
        hiring?: import('svelte').Snippet;
    }>();

    let prefs = $state($prefsStore);
    $effect(() => {
        return prefsStore.subscribe(p => {
            prefs = p;
        });
    });
    
    // To track pulse state
    let isPulsing = $state(false);
    
    let currentMode = $derived(prefs.hiringMode);
    let lastMode = $state($prefsStore.hiringMode);
    
    $effect(() => {
        if (currentMode !== lastMode) {
            isPulsing = true;
            setTimeout(() => isPulsing = false, 800);
            lastMode = currentMode;
        }
    });
</script>

<div class="relative transition-all duration-500 {isPulsing ? 'ring-2 ring-blue-400/80 bg-blue-500/5 rounded-xl scale-[1.01]' : ''}">
    {#if prefs.hiringMode && hiring}
        {@render hiring()}
    {:else}
        {@render children()}
    {/if}
</div>
