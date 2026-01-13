import type { CacheEntry } from "./types.js";

const TTL = 24 * 60 * 60 * 1000; // 24 hours

const registryCache = new Map<string, CacheEntry>();

export function getRepoFromMemory(name: string) {
    const cached = registryCache.get(name); 
    if (cached && Date.now() - cached.timestamp < TTL) {
        return cached.data;
    }

    if (cached) {
        registryCache.delete(name);
    }
}

export function storeRepoInMemory(name: string, data: any) {
    registryCache.set(name, {
        data,
        timestamp: Date.now()
    });
}

const downloadCache = new Map<string, CacheEntry>();

export function getDownloadsFromMemory(name: string) {
    const cached = downloadCache.get(name);
    if (cached && Date.now() - cached.timestamp < TTL) {
        return cached.data;
    }

    if (cached) {
        downloadCache.delete(name);
    }
}

export function storeDownloadsInMemory(name: string, data: any) {
    downloadCache.set(name, {
        data,
        timestamp: Date.now()
    });
}