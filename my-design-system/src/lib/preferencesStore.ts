import { writable } from 'svelte/store';

export type ThemePref = 'dark' | 'light' | 'system';
export type ReducedMotionPref = 'true' | 'false' | 'system';

export interface UserPrefs {
    theme: ThemePref;
    language: string;
    hiringMode: boolean;
    reducedMotion: ReducedMotionPref;
}

export const defaultPrefs: UserPrefs = {
    theme: 'system',
    language: 'en',
    hiringMode: false,
    reducedMotion: 'system'
};

function createPrefsStore() {
    // Start with defaultPrefs. In Astro, the actual initial state must be passed from the server
    const { subscribe, set, update } = writable<UserPrefs>(defaultPrefs);

    return {
        subscribe,
        // init is called once by Layout or a root component passing Astro.locals.prefs
        init: (initialState: UserPrefs) => {
            set({ ...defaultPrefs, ...initialState });
        },
        updatePref: <K extends keyof UserPrefs>(key: K, value: UserPrefs[K]) => {
            update(prefs => {
                const newPrefs = { ...prefs, [key]: value };
                
                // Update cookie in background
                if (typeof document !== 'undefined') {
                    document.cookie = `user-prefs=${encodeURIComponent(JSON.stringify(newPrefs))}; path=/; max-age=31536000; samesite=lax`;
                    
                    // Attempt immediate DOM updates for certain properties
                    if (key === 'theme') {
                        applyTheme(value as ThemePref);
                    } else if (key === 'language') {
                        document.documentElement.lang = value as string;
                    } else if (key === 'reducedMotion') {
                        applyMotion(value as ReducedMotionPref);
                    }
                }
                
                return newPrefs;
            });
        }
    };
}

export const prefsStore = createPrefsStore();

export function applyTheme(theme: ThemePref) {
    if (typeof document === 'undefined') return;
    
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }
}

export function applyMotion(motion: ReducedMotionPref) {
    if (typeof document === 'undefined') return;

    if (motion === 'true' || (motion === 'system' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
        document.documentElement.removeAttribute('data-reduced-motion');
    }
}
