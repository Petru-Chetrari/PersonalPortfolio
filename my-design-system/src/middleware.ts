import { defineMiddleware } from 'astro:middleware';
import { defaultPrefs } from './lib/preferencesStore';
import type { UserPrefs } from './lib/preferencesStore';
import { decodeJwt } from './lib/auth-utils';

export const onRequest = defineMiddleware(async (context, next) => {
    console.log('[middleware] Intercepted request to:', context.request.url);
    console.log('[middleware] Raw Cookie Header:', context.request.headers.get('cookie'));

    // Auth Gating
    const url = new URL(context.request.url);
    const protectedPaths = ['/admin', '/client'];
    const isProtected = protectedPaths.some(p => url.pathname.startsWith(p));

    if (isProtected) {
        let accessToken = context.cookies.get('access_token')?.value;
        const refreshToken = context.cookies.get('refresh_token')?.value;

        console.log('[auth] Protected route:', url.pathname);
        console.log('[auth] access_token present:', !!accessToken);
        console.log('[auth] refresh_token present:', !!refreshToken);

        if (!accessToken && !refreshToken) {
            console.log('[auth]  No tokens at all → redirect /signin');
            return context.redirect('/signin');
        }

        // Try to refresh token if we only have a refresh token or if we want to proactively refresh
        if (!accessToken && refreshToken) {
            try {
                let apiBase = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
                // Ensure the URL has a protocol
                if (!apiBase.startsWith('http://') && !apiBase.startsWith('https://')) {
                    apiBase = `http://${apiBase}`;
                }
                console.log('[auth] Attempting token refresh via:', `${apiBase}/api/auth/refresh`);
                const res = await fetch(`${apiBase}/api/auth/refresh`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ refreshToken })
                });
                
                if (res.ok) {
                    const data = await res.json();
                    accessToken = data.accessToken;
                    context.cookies.set('access_token', accessToken as string, {
                        path: '/',
                        secure: url.protocol === 'https:',
                        sameSite: 'lax',
                        maxAge: 900 // 15 mins
                    });
                    console.log('[auth]   Token refreshed successfully');
                } else {
                    console.warn('[auth]    Token refresh failed:', res.status, res.statusText);
                    return context.redirect('/signin');
                }
            } catch (err) {
                console.error('[auth]    Token refresh error:', err);
                return context.redirect('/signin');
            }
        }

        if (accessToken) {
            const payload = decodeJwt(accessToken);
            console.log('[auth] JWT payload:', JSON.stringify(payload));
            if (!payload) {
                console.log('[auth]    decodeJwt returned null → redirect /signin');
                return context.redirect('/signin');
            }

            context.locals.user = { id: payload.sub, role: payload.role, username: payload.username };
            console.log('[auth]   User authenticated:', payload.username, 'role:', payload.role);

            if (url.pathname.startsWith('/admin') && payload.role !== 'admin') {
                console.log('[auth] ⚠️ Non-admin on /admin → redirect /client/commissions');
                return context.redirect('/client/commissions');
            }
            if (url.pathname.startsWith('/client') && payload.role !== 'client') {
                console.log('[auth] ⚠️ Non-client on /client → redirect /admin');
                return context.redirect('/admin');
            }
        } else {
            console.log('[auth]    No access token after refresh attempt → redirect /signin');
            return context.redirect('/signin');
        }
    }

    return next();
});
