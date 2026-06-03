export function decodeJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Pad the base64 string with '=' so its length is a multiple of 4.
        // Node's native `atob` is strict and will throw without padding.
        while (base64.length % 4) {
            base64 += '=';
        }

        let jsonPayload = '';
        
        // Use Buffer if available (Node.js environment)
        if (typeof Buffer !== 'undefined') {
            jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
        } 
        // Fallback to atob for browser/edge environments
        else if (typeof atob === 'function') {
            jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } else {
            return null;
        }

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('[auth-utils] Error decoding JWT:', e);
        return null;
    }
}

export function setupInactivityTimer(timeoutMs = 900000) { // 15 mins default
    if (typeof window === 'undefined') return;
    console.log('[auth-utils] Setting up inactivity timer');
    
    let timer: number;
    const resetTimer = () => {
        clearTimeout(timer);
        timer = window.setTimeout(() => {
            // Auto logout
            window.location.href = '/signout';
        }, timeoutMs) as unknown as number;
    };
    
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(
        evt => document.addEventListener(evt, resetTimer, true)
    );
    
    resetTimer();
}

export function getAccessTokenFromCookie() {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(^| )access_token=([^;]+)/);
    if (match) return match[2];
    return null;
}
