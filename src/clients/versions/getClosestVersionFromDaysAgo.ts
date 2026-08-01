import { getValidVersions } from "./getValidVersions";

export function getClosestVersionFromDaysAgo(versions: Record<string, string>, safeAge = 3) {
    const validVersions = getValidVersions(versions);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - safeAge);
    const targetTime = targetDate.getTime();

    let closest = validVersions[0];
    let minDiff = Math.abs(new Date(validVersions[0][1]).getTime() - targetTime);

    for (const [ver, timestamp] of validVersions) {
        const diff = Math.abs(new Date(timestamp).getTime() - targetTime);
        if (diff < minDiff) {
            minDiff = diff;
            closest = [ver, timestamp];
        }
    }

    return closest;
}