import { getValidVersions } from "./getValidVersions";
import { compare } from "semver";

function sorter(a: [string, string], b: [string, string]) {
    const versionCompare = compare(a[0], b[0]);
    if (versionCompare !== 0) {
        return versionCompare;
    }

    return new Date(a[1]).getTime() - new Date(b[1]).getTime();
}

function sortVersions(versions: Record<string, string>) {
    const validVersions = getValidVersions(versions);
    return validVersions.sort(sorter);
}

export function getClosestVersionFromDaysAgo(versions: Record<string, string>, safeAge = 3) {
    const sortedVersions = sortVersions(versions);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - safeAge);
    const targetTime = targetDate.getTime();

    let closest = sortedVersions[0];
    let minDiff = Math.abs(new Date(sortedVersions[0][1]).getTime() - targetTime);

    for (const [ver, timestamp] of sortedVersions) {
        const diff = Math.abs(new Date(timestamp).getTime() - targetTime);
        if (diff < minDiff) {
            minDiff = diff;
            closest = [ver, timestamp];
        }
    }

    return closest;
}