import { valid, prerelease } from "semver";

export function getValidVersions(versions: Record<string, string>) {
    const includePreRelease = false;
    const validVersions: [string, string][] = [];
    for (const [version, timestamp] of Object.entries(versions)) {
        if (!valid(version)) {
            continue;
        }

        if (includePreRelease) {
            validVersions.push([version, timestamp]);
        } else if (!prerelease(version)) {
            validVersions.push([version, timestamp]);
        }
    }

    return validVersions;
}