import type { TextDocument, DecorationOptions } from "vscode";
import { Range } from "vscode";
import { registryCache } from "../cache/memCache";

export function processDependencies(document: TextDocument, fileText: string, deps: Record<string, string>, decorations: DecorationOptions[]) {
	for (const [packageName, version] of Object.entries(deps)) {
		const regrex = new RegExp(`"${escapeRegex(packageName)}"\\s*:\\s*"${escapeRegex(version)}"`, 'g');
		const match = regrex.exec(fileText);

		if (match) {
			const pos = document.positionAt(match.index + match[0].length);
            const metadata = registryCache.get(packageName)?.data;
            const latestVersion = metadata['dist-tags'].latest;

			decorations.push({
				range: new Range(pos, pos),
				renderOptions: {
					after: {
						contentText: latestVersion,
						color: 'orange',
					}
				}
			});
		}
	}
}

function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}