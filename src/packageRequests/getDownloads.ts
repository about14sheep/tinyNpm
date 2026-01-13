import { getDownloadsFromMemory, storeDownloadsInMemory } from "../cache/memCache";

async function getWeeklyDownloads(packageName: string): Promise<number> {
    try {
        const response = await fetch(`https://api.npmjs.org/downloads/point/last-week/${packageName}`);
        if (!response.ok) {
            console.error(`Failed to fetch downloads for ${packageName}`);
            return -1;
        }

        const data = await response.json() as { downloads: number };
        return data.downloads || 0;
    } catch (err) {
        console.error(`Error fetching downloads for ${packageName}:`, err);
        return -1;
    }
}

export async function getDownloads(packageName: string) {
    const chachedDownloads = getDownloadsFromMemory(packageName);
    if (!chachedDownloads) {
        const downloads = await getWeeklyDownloads(packageName);
        storeDownloadsInMemory(packageName, downloads);
    }
}