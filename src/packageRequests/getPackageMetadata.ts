import { getRepoFromMemory, storeRepoInMemory } from "../cache/memCache";

export async function getPackageMetadata(packageName: string) {
    try {
        const cachedMetadata = getRepoFromMemory(packageName);
        if (!cachedMetadata) {
            const response = await fetch(`https://registry.npmjs.org/${packageName}`);
            if (!response.ok) {
                throw new Error(`Package not found: ${packageName}`);
            }

           const data = await response.json() as any;
           storeRepoInMemory(packageName, data);
        }
    } catch (err) {
        console.error(`Error getting metadata for package ${packageName}`);
    }
}