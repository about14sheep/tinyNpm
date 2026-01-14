import { Hover, languages, MarkdownString } from "vscode";
import { decorationRanges } from "../../decorations/decorationRangeMap";
import { getRepoFromMemory } from "../../cache/memCache";
import { createHeader } from "../util/hoverMenuHeader";
import { createUpdateCommand } from "./updateCommand";

function createReleaseDate(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function createUpdateButton(packageName: string, version: string, line: number, key: number) {
    return `command:tinynpm.updateVersion?${encodeURIComponent(JSON.stringify([packageName, version, line, key]))}`;
}

export function createVersionsHoverMenu() {
    return languages.registerHoverProvider(
        { scheme: 'file', pattern: '**/package.json' },
        {
            provideHover(document, position, token) {
                if (!document.fileName.endsWith("package.json")) {
                    return null;
                }

                for (const [line, decoration] of decorationRanges) {
                    if (decoration.range.contains(position)) {
                        const markdown = new MarkdownString();
                        markdown.supportThemeIcons = true;
                        markdown.isTrusted = true;
                        const packageData = getRepoFromMemory(decoration.packageName);
                        const repoUrl = packageData.repository.url;
                        const homepageUrl = packageData.homepage;
                        markdown.appendMarkdown(createHeader(repoUrl, homepageUrl, decoration.packageName));
                        markdown.appendMarkdown(`[Latest Version Update](${createUpdateButton(decoration.packageName, decoration.latest.version, position.line, line)}): ${decoration.latest.version} published ${createReleaseDate(decoration.latest.release)}\n\n`);
                        markdown.appendMarkdown(`[Safe Version Update](${createUpdateButton(decoration.packageName, decoration.safest.version, position.line, line)}): ${decoration.safest.version} published ${createReleaseDate(decoration.safest.release)}`);

                        return new Hover(markdown, decoration.range);
                    }
                }

                return null;
            }
        }
    );
}