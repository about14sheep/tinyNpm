import type { NpmRC, NpmRcCache } from "./types";

const TTL = 24 * 60 * 60 * 1000; // 24 hours

const npmrcCache = new Map<string, NpmRcCache>();

export function getNpmrcFromCache(project?: string) {
  if (!project) {
    return;
  }
  const cached = npmrcCache.get(project);
  if (cached && Date.now() - cached.timestamp < TTL) {
    return cached.npmrc;
  }

  if (cached) {
    npmrcCache.delete(project);
  }
}

export function storeNpmrc(project: string, data: NpmRC) {
  npmrcCache.set(project, {
    npmrc: data,
    timestamp: Date.now(),
  });
}
