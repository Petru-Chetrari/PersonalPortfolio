import { defineMiddleware } from 'astro:middleware';
import { defaultPrefs } from './lib/preferencesStore';
import type { UserPrefs } from './lib/preferencesStore';

export const onRequest = defineMiddleware((context, next) => {
    const prefsCookie = context.cookies.get('user-prefs');
    let prefs: UserPrefs = { ...defaultPrefs };
    
    if (prefsCookie && prefsCookie.value) {
        try {
            const parsed = JSON.parse(decodeURIComponent(prefsCookie.value));
            prefs = { ...defaultPrefs, ...parsed };
        } catch(e) {
            // invalid cookie
        }
    }
    
    context.locals.prefs = prefs;
    return next();
});
