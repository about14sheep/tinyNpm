import type { CacheEntry } from "./types.js";

const TTL_REGISTRY = 24 * 60 * 60 * 1000; // 24 hours
const TTL_DOWNLOADS = 24 * 60 * 60 * 1000; // 24 hours

export const registryCache = new Map<string, CacheEntry>();

export const downloadCache = new Map<string, CacheEntry>();