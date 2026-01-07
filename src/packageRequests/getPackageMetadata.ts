import { registryCache } from "../cache/memCache";

export async function getPackageMetadata(packageName: string) {
    try {
        if (!registryCache.has(packageName)) {
            const response = await fetch(`https://registry.npmjs.org/${packageName}`);
            if (!response.ok) {
                throw new Error(`Package not found: ${packageName}`);
            }

           const data = await response.json() as any;

           registryCache.set(packageName, {
            data,
            timestamp: Date.now()
           });
        }
    } catch (err) {
        console.error(`Error getting metadata for package ${packageName}`);
    }
}