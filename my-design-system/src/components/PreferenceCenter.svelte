<script lang="ts">
    import { prefsStore, type ThemePref, type ReducedMotionPref } from '../lib/preferencesStore';

    let isOpen = $state(false);

    let prefs = $state($prefsStore);
    $effect(() => {
        return prefsStore.subscribe(p => prefs = p);
    });

    const closeHandler = () => {
        isOpen = false;
    };

    function setTheme(theme: ThemePref) { prefsStore.updatePref('theme', theme); }
    function setLang(val: string) { prefsStore.updatePref('language', val); }
    function toggleHiring() { prefsStore.updatePref('hiringMode', !prefs.hiringMode); }
    function setMotion(m: ReducedMotionPref) { prefsStore.updatePref('reducedMotion', m); }

</script>

<!-- Trigger Button -->
<button
    onclick={() => isOpen = true}
    class="relative shrink-0 flex items-center justify-center gap-2 h-[36px] px-[16px] bg-slate-800 border-slate-700 border-[0.8px] border-solid rounded-full hover:bg-slate-700 hover:shadow-md transition-all cursor-pointer group"
    aria-label="Settings"
>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-slate-400 group-hover:text-slate-50 transition-colors">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="font-['Segoe_UI',sans-serif] font-semibold text-[14px] leading-[20px] text-slate-300 group-hover:text-slate-50 transition-colors">Settings</span>
</button>

{#if isOpen}
    <!-- Overlay -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[90] transition-opacity"
        onclick={closeHandler}
    ></div>

    <!-- Modal Panel -->
    <div
        class="fixed top-[80px] right-[24px] md:top-[80px] md:right-[40px] w-[340px] z-[100] bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-['Segoe_UI',sans-serif] origin-top-right animate-in fade-in slide-in-from-top-4"
        style="animation-duration: 200ms;"
    >
        <div class="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
            <h3 class="text-lg font-bold text-slate-50">Preferences</h3>
            <button onclick={closeHandler} class="text-slate-500 hover:text-slate-300 transition-colors" aria-label="Close settings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>

        <div class="p-5 flex flex-col gap-6">

            <!-- Hiring Mode -->
            <div>
                <div class="flex justify-between items-center mb-2">
                    <div>
                        <div class="text-sm font-semibold text-slate-100 flex items-center gap-2">
                            Hiring Mode
                            {#if prefs.hiringMode}
                                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">ACTIVE</span>
                            {/if}
                        </div>
                        <div class="text-xs text-slate-400">Distill complex UI to metric-focused bullets</div>
                    </div>
                    <!-- Switch -->
                    <button
                        onclick={toggleHiring}
                        class="relative w-11 h-6 rounded-full transition-colors flex items-center shadow-inner cursor-pointer"
                        style={prefs.hiringMode ? 'background-color:#3B82F6;' : 'background-color:#334155;'}
                        aria-label="Toggle hiring mode"
                    >
                        <span class="absolute left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform {prefs.hiringMode ? 'translate-x-5' : ''}"></span>
                    </button>
                </div>
            </div>

            <!-- Theme -->
            <div>
                <div class="text-sm font-semibold text-slate-100 mb-2">Appearance</div>
                <div class="flex bg-slate-800 p-1 rounded-lg gap-1">
                    {#each ['dark', 'light', 'system'] as t}
                        <button
                            class="flex-1 text-xs py-1.5 rounded-md text-center capitalize font-medium transition-all {prefs.theme === t ? 'bg-slate-700 text-slate-50 shadow-sm' : 'text-slate-400 hover:text-slate-200'}"
                            onclick={() => setTheme(t as ThemePref)}
                        >
                            {t}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Language -->
            <div>
                <div class="text-sm font-semibold text-slate-100 mb-2">Language</div>
                <div class="flex bg-slate-800 p-1 rounded-lg gap-1">
                    {#each [{code:'en', label:'English'}, {code:'es', label:'Español'}, {code:'fr', label:'Français'}] as lang}
                        <button
                            class="flex-1 text-xs py-1.5 rounded-md text-center font-medium transition-all {prefs.language === lang.code ? 'bg-slate-700 text-slate-50 shadow-sm' : 'text-slate-400 hover:text-slate-200'}"
                            onclick={() => setLang(lang.code)}
                        >
                            {lang.label}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Reduced Motion -->
            <div>
                <div class="text-sm font-semibold text-slate-100 mb-2">Animations (Reduced Motion)</div>
                <div class="flex bg-slate-800 p-1 rounded-lg gap-1">
                    {#each [{val:'false', label:'Full'}, {val:'true', label:'Reduced'}, {val:'system', label:'System'}] as r}
                        <button
                            class="flex-1 text-xs py-1.5 rounded-md text-center font-medium transition-all {prefs.reducedMotion === r.val ? 'bg-slate-700 text-slate-50 shadow-sm' : 'text-slate-400 hover:text-slate-200'}"
                            onclick={() => setMotion(r.val as ReducedMotionPref)}
                        >
                            {r.label}
                        </button>
                    {/each}
                </div>
            </div>
            
        </div>
    </div>
{/if}
