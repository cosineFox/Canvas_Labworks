// Global state for caching API data across page navigations
export const globalState = $state({
    blueskyPosts: [] as any[],
    techPosts: [] as any[],
    steamGames: [] as any[],
    steamError: null as string | null,
    status: null as any,
    isOpenForShoots: true,
    visitorCount: null as number | null,
    
    // Track if we have already fetched the data
    lastFetched: {
        bluesky: 0,
        steam: 0,
        status: 0,
        visitors: 0
    }
});

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export function shouldFetch(key: keyof typeof globalState.lastFetched) {
    const now = Date.now();
    return (now - globalState.lastFetched[key]) > CACHE_DURATION;
}

export function updateFetchTime(key: keyof typeof globalState.lastFetched) {
    globalState.lastFetched[key] = Date.now();
}
