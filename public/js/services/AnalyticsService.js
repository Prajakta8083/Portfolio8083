/**
 * AnalyticsService
 * Privacy-first, anonymous usage tracking.
 * NO IPs, NO PII, NO Cookies (uses ephemeral session storage).
 */

const ANALYTICS_KEY = 'portfolio_analytics_session';

export const AnalyticsService = {
    init() {
        if (this.hasLoggedSession()) {
            // Already logged this session, just log navigation events if needed
            console.log('[Analytics] Session active.');
            return;
        }

        // Log new visit
        this.logVisit();
        this.setSession();
    },

    hasLoggedSession() {
        return sessionStorage.getItem(ANALYTICS_KEY) === 'true';
    },

    setSession() {
        sessionStorage.setItem(ANALYTICS_KEY, 'true');
    },

    logVisit() {
        // In a real app, this sends a POST to an edge function.
        // For this architecture, we simulate logging to a separate local store.

        const stats = this.getStats();
        stats.totalVisits++;

        const ua = navigator.userAgent;
        if (/Mobi|Android/i.test(ua)) {
            stats.deviceStats.mobile++;
        } else {
            stats.deviceStats.desktop++;
        }

        this.saveStats(stats);
        console.log('[Analytics] Anonymous visit logged.');
    },

    // Separation of concerns: Analytics data stored separately from content
    getStats() {
        const raw = localStorage.getItem('analytics_db_v1');
        return raw ? JSON.parse(raw) : {
            totalVisits: 0,
            deviceStats: { mobile: 0, desktop: 0 }
        };
    },

    saveStats(stats) {
        localStorage.setItem('analytics_db_v1', JSON.stringify(stats));
    }
};
