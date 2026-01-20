import { getRepoFromMemory, storeRepoInMemory } from "../cache/memCache";
import { getNpmrcFromCache } from "../cache/npmrcCache";
import { getAuthTokenForRegistry, getRegistryForPackage } from "../clients/util/getNpmUrl";
import { getDownloads } from "./getDownloads";

async function fetchPackageInfo(name: string, wsRoot?: string) {
    const config = getNpmrcFromCache(wsRoot);
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
        if (!cachedMetadata) {
            const response = await fetchPackageInfo(packageName, wsRoot);
            if (!response.ok) {
                throw new Error(`Package not found: ${packageName}`);
            }

           const data = await response.json() as any;
           storeRepoInMemory(packageName, data);
        }

        await getDownloads(packageName);
    } catch (err) {
        console.error(`Error getting metadata for package ${packageName}`, err);
    }
}