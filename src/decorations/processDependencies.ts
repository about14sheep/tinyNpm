import type { TextDocument, DecorationOptions } from "vscode";
import { Range, workspace } from "vscode";
import { getDownloadsFromMemory, getRepoFromMemory } from "../cache/memCache";
import { getClosestVersionFromDaysAgo } from "../clients/versions/getClosestVersionFromDaysAgo";
import { decorationRanges } from "./decorationRangeMap";
import { outputChannel } from "../extension";
import { getErrorMessage } from "../clients/util/getErrorMessage";

export function processDependencies(
  document: TextDocument,
  fileText: string,
  deps: Record<string, string>,
  decorations: DecorationOptions[],
) {
  for (const [packageName, version] of Object.entries(deps)) {
    try {
      const cleanVersion = version.replace(/^[\^~]/, "");
      const regrex = new RegExp(
        `"${escapeRegex(packageName)}"\\s*:\\s*"${escapeRegex(version)}"`,
        "g",
      );
      const match = regrex.exec(fileText);

      if (match) {
        const verPos = document.positionAt(match.index + match[0].length);
        const pos = document.lineAt(verPos.line).range.end;
        const metadata = getRepoFromMemory(packageName);
        const numberOfDependencies = Object.keys(
          metadata.versions[cleanVersion].dependencies || {},
        ).length;
        const downloadCount = getDownloadsFromMemory(packageName) || -1;
        const config = workspace.getConfiguration("tinynpm");
        const bufferPeriod = config.get<number>("versionBufferPeried", 3);
        const safeVersion = getClosestVersionFromDaysAgo(
          metadata.time,
          bufferPeriod,
        );
        const latestVersion = metadata["dist-tags"].latest;
        const latestVersionRelease = metadata.time[latestVersion];
        const currentVersionRelease = metadata.time[cleanVersion];
        const range = new Range(pos, pos);
        const currentDate = new Date(currentVersionRelease);
        const safeVersionDate = new Date(safeVersion[1]);
        const hideDeco =
          currentDate >= safeVersionDate ||
          currentDate >= new Date(latestVersionRelease);

        if (!hideDeco) {
          decorations.push({
            range,
            renderOptions: {
              after: {
                contentText: safeVersion[0],
                color: "orange",
              },
            },
          });
        }

        decorationRanges.set(match.index, {
          range,
          packageName,
          depCount: numberOfDependencies,
          downloads: downloadCount,
          currentVersion: cleanVersion,
          age: currentVersionRelease,
          latest: {
            version: latestVersion,
            release: latestVersionRelease,
          },
          safest: {
            version: safeVersion[0],
            release: safeVersion[1],
          },
        });
      }
    } catch (error: unknown) {
      outputChannel.appendLine(
        `Error processing dependency ${packageName}: ${getErrorMessage(error)}`,
      );
    }
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
