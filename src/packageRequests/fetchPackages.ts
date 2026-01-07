import { getPackageMetadata } from "./getPackageMetadata";

export async function fetchPackages(packageNames: string[]) {
    const promises = packageNames.map(name => getPackageMetadata(name));
    await Promise.all(promises);
}