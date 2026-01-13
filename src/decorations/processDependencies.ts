import type { TextDocument, DecorationOptions } from "vscode";
import { Range } from "vscode";
import { getRepoFromMemory } from "../cache/memCache";
import { getClosestVersionFromDaysAgo } from "../clients/versions/getClosestVersionFromDaysAgo";
import { decorationRanges } from "./decorationRangeMap";

export function processDependencies(document: TextDocument, fileText: string, deps: Record<string, string>, decorations: DecorationOptions[]) {
	const ranges = [];
	for (const [packageName, version] of Object.entries(deps)) {
		const regrex = new RegExp(`"${escapeRegex(packageName)}"\\s*:\\s*"${escapeRegex(version)}"`, 'g');
		const match = regrex.exec(fileText);

		if (match) {
			const pos = document.positionAt(match.index + match[0].length);
            const metadata = getRepoFromMemory(packageName);
			const safeVersion = getClosestVersionFromDaysAgo(metadata.time);
            const latestVersion = metadata['dist-tags'].latest;
			const latestVersionRelease = metadata.time[latestVersion];
			const range = new Range(pos, pos);

			decorations.push({
				range,
				renderOptions: {
					after: {
						contentText: safeVersion[0],
						color: 'orange',
					}
				}
			});

			decorationRanges.set(match.index, {
				range,
				packageName,
				latest: {
					version: latestVersion,
					release: latestVersionRelease, 
				},
				safest: {
					version: safeVersion[0],
					release: safeVersion[1]
				}
			});
		}
	}
}

function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}