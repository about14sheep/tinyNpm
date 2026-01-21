import type { NpmRC } from "../cache/types";
import { getRepoFromMemory, storeRepoInMemory } from "../cache/memCache";
import { getNpmrcFromCache } from "../cache/npmrcCache";
import { getAuthTokenForRegistry, getRegistryForPackage, isNpmRegistry } from "../clients/util/getNpmUrl";
import { getDownloads } from "./getDownloads";

async function fetchPackageInfo(name: string, config?: NpmRC) {
    if (!config) {
        return fetch(`https://registry.npmjs.org/${name}`);
    }

    const registry = getRegistryForPackage(name, config);
    const authToken = getAuthTokenForRegistry(registry, config);
    const headers: Record<string, string> = {
        'Accept': 'application/json'
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    return fetch(`${registry}/${name}`, { headers });
}

export async function getPackageMetadata(packageName: string, wsRoot?: string) {
    try {
        const cachedMetadata = getRepoFromMemory(packageName);
        const config = getNpmrcFromCache(wsRoot);

        if (!cachedMetadata) {
            const response = await fetchPackageInfo(packageName, config);
            if (!response.ok) {
                throw new Error(`Package not found: ${packageName}`);
            }

           const data = await response.json() as any;
           storeRepoInMemory(packageName, data);
        }
 
        // Only get downloads if the current registry is npm
        if (config) {
            const registry = getRegistryForPackage(packageName, config);
            if (!isNpmRegistry(registry)) {
                return;
            }
        }

        await getDownloads(packageName);
    } catch (err) {
        console.error(`Error getting metadata for package ${packageName}`, err);
    }
}