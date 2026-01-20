export interface CacheEntry {
    data: any,
    timestamp: number;
}

export interface NpmRC {
    merged: Record<string, string>;
    sources: {
        user: Record<string, string>;
        project: Record<string, string>;
    }
}

export interface NpmRcCache {
    npmrc: NpmRC;
    timestamp: number;
}
