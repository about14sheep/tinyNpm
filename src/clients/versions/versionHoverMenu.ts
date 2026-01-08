import { Hover, languages, MarkdownString } from "vscode";
import { decorationRanges } from "../../decorations/decorationRangeMap";

function createReleaseDate(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
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
                        markdown.appendMarkdown(`**${decoration.packageName}**\n\n`);
                        markdown.appendMarkdown(`Latest Version: ${decoration.latest.version}\n\n`);
                        markdown.appendMarkdown(`Safe Version: ${decoration.safest.version} published ${createReleaseDate(decoration.safest.release)}`);

                        return new Hover(markdown, decoration.range);
                    }
                }

                return null;
            }
        }
    );
}