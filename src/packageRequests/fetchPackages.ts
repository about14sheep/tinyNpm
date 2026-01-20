import { getPackageMetadata } from "./getPackageMetadata";

export async function fetchPackages(packageNames: string[], wsRoot?: string) {
    const promises = packageNames.map(name => getPackageMetadata(name, wsRoot));
    await Promise.all(promises);
}