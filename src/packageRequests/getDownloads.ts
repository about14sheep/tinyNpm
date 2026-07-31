import {
  getDownloadsFromMemory,
  storeDownloadsInMemory,
} from "../cache/memCache";
import { getErrorMessage } from "../clients/util/getErrorMessage";
import { outputChannel } from "../extension";

async function getWeeklyDownloads(packageName: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${packageName}`,
    );
    if (!response.ok) {
      outputChannel.appendLine(`Failed to fetch downloads for ${packageName}`);
      return -1;
    }

    const data = (await response.json()) as { downloads: number };
    return data.downloads || 0;
  } catch (err) {
    outputChannel.appendLine(
      `Error fetching downloads for ${packageName}: ${getErrorMessage(err)}`,
    );
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
