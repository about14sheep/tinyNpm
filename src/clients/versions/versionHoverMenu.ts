import { Hover, languages, MarkdownString, workspace } from "vscode";
import { decorationRanges } from "../../decorations/decorationRangeMap";
import { createPackageDetailsMarkdown } from "../package/createPackageDetailsMarkdown";
import { getTimeAgo } from "../util/publishedDaysAgo";
import { outputChannel } from "../../extension";
import { getErrorMessage } from "../util/getErrorMessage";

function createOpenSettingsButton(period: number) {
    return `[⚙️ Change Buffer](command:workbench.action.openSettings?${encodeURIComponent(JSON.stringify(['tinynpm.versionBufferPeriod']))} "Current buffer: ${period} day(s)")`;
}

function createUpdateButton(packageName: string, version: string, line: number, key: number) {
    return `command:tinynpm.updateVersion?${encodeURIComponent(JSON.stringify([packageName, version, line, key]))}`;
}

export function createVersionsHoverMenu() {
    return languages.registerHoverProvider(
        { scheme: 'file', pattern: '**/package.json' },
        {
            provideHover(document, position, token) {
                if (!document.fileName.endsWith('package.json')) {
                    return null;
                }

                for (const [line, decoration] of decorationRanges) {
                    if (decoration.range.contains(position)) {
                        try {
                            const markdown = createPackageDetailsMarkdown(decoration);
                            const config = workspace.getConfiguration('tinynpm');
                            const bufferPeriod = config.get<number>('versionBufferPeriod', 3);
                            const latestUpdateButton = createUpdateButton(decoration.packageName, decoration.latest.version, position.line, line);
                            const bufferedUpdateButton = createUpdateButton(decoration.packageName, decoration.safest.version, position.line, line);
                            markdown.appendMarkdown('---\n\n');
                            markdown.appendMarkdown(`[Update to buffered](${bufferedUpdateButton} "Version ${decoration.safest.version} ${getTimeAgo(decoration.safest.release)}") &nbsp; &nbsp; &nbsp;`);
                            markdown.appendMarkdown(`[Update to latest](${latestUpdateButton} "Version ${decoration.latest.version} ${getTimeAgo(decoration.latest.release)}") &nbsp; &nbsp; &nbsp;`);
                            markdown.appendMarkdown(`${createOpenSettingsButton(bufferPeriod)}`);

                            return new Hover(markdown, decoration.range);
                        } catch (err: unknown) {
                            outputChannel.appendLine(`Failed getting hover info for package ${decoration.packageName}: ${getErrorMessage(err)}`);
                        } 
                    }
                }

                return null;
            }
        }
    );
}