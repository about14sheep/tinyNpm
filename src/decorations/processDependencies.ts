import type { TextDocument, DecorationOptions } from "vscode";
import { Range, workspace } from "vscode";
import { getRepoFromMemory } from "../cache/memCache";
import { getClosestVersionFromDaysAgo } from "../clients/versions/getClosestVersionFromDaysAgo";
import { decorationRanges } from "./decorationRangeMap";

export function processDependencies(document: TextDocument, fileText: string, deps: Record<string, string>, decorations: DecorationOptions[]) {
	for (const [packageName, version] of Object.entries(deps)) {
        const cleanVersion = version.replace(/^[\^~]/, '');
		const regrex = new RegExp(`"${escapeRegex(packageName)}"\\s*:\\s*"${escapeRegex(version)}"`, 'g');
		const match = regrex.exec(fileText);

		if (match) {
			const pos = document.positionAt(match.index + match[0].length);
            const metadata = getRepoFromMemory(packageName);
			const config = workspace.getConfiguration('tinynpm');
			const bufferPeriod = config.get<number>('versionBufferPeried', 3);
			const safeVersion = getClosestVersionFromDaysAgo(metadata.time, bufferPeriod);
            const latestVersion = metadata['dist-tags'].latest;
			const latestVersionRelease = metadata.time[latestVersion];
			const currentVersionRelease = metadata.time[cleanVersion];
			const range = new Range(pos, pos);
			const currentDate = new Date(currentVersionRelease);
			const safeVersionDate = new Date(safeVersion[1]);
			const hideDeco = currentDate >= safeVersionDate || currentDate >= new Date(latestVersionRelease);

			if (!hideDeco) {
				decorations.push({
					range,
					renderOptions: {
						after: {
							contentText: safeVersion[0],
							color: 'orange',
						}
					}
				});
			}

			const versionStartIndex = match.index + match[0].indexOf(`"${version}"`);
			const versionStartPos = document.positionAt(versionStartIndex);
			const hoverRange = new Range(versionStartPos, pos);

			decorationRanges.set(match.index, {
				range: hoverRange,
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