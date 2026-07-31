import { getErrorMessage } from "../clients/util/getErrorMessage";
import { outputChannel } from "../extension";
import { getPackageMetadata } from "./getPackageMetadata";

export async function fetchPackages(packageNames: string[], wsRoot?: string) {
  try {
    const promises = packageNames.map((name) =>
      getPackageMetadata(name, wsRoot),
    );
    await Promise.all(promises);
  } catch (err: unknown) {
    outputChannel.appendLine(
      `Failed getting metadata for packages: ${getErrorMessage(err)}`,
    );
  }
}
