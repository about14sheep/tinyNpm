import { Hover, languages, MarkdownString, workspace } from "vscode";
import { decorationRanges } from "../../decorations/decorationRangeMap";
import { getRepoFromMemory } from "../../cache/memCache";
import { createHeader } from "../util/hoverMenuHeader";
import { getTimeAgo } from "../util/publishedDaysAgo";

function createOpenSettingsButton() {
    return `[⚙️ Change Buffer](command:workbench.action.openSettings?${encodeURIComponent(JSON.stringify(['tinynpm.versionBufferPeriod']))})`;
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
                        const config = workspace.getConfiguration('tinynpm');
                        const bufferPeriod = config.get<number>('versionBufferPeriod', 3);
                        const repoUrl = packageData.repository.url;
                        const homepageUrl = packageData.homepage;
                        const latestUpdateButton = createUpdateButton(decoration.packageName, decoration.safest.version, position.line, line);
                        const bufferedUpdateButton = createUpdateButton(decoration.packageName, decoration.safest.version, position.line, line);
                        markdown.appendMarkdown(createHeader(repoUrl, homepageUrl, decoration.packageName));
                        markdown.appendMarkdown(
                            `Latest: ${decoration.latest.version} (${getTimeAgo(decoration.latest.release)})\n\n`
                        );
                        markdown.appendMarkdown(
                            `Buffered: ${decoration.safest.version} (${getTimeAgo(decoration.safest.release)}) ✓\n\n`
                        );
                        markdown.appendMarkdown(`💡 Buffered versions exclude packages published within ${bufferPeriod} days\n\n`);
                        markdown.appendMarkdown('---\n\n');
                        markdown.appendMarkdown(`[Update to buffered](${bufferedUpdateButton}) &nbsp; &nbsp; &nbsp; [Update to latest](${latestUpdateButton}) &nbsp; &nbsp; &nbsp; ${createOpenSettingsButton()}`);

                        return new Hover(markdown, decoration.range);
                    }
                }

                return null;
            }
        }
    );
}