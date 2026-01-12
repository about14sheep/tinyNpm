import { Hover, languages, MarkdownString, Range } from "vscode";
import DependencyWarning from "../warnings/DependencyWarning";
import { getRepoFromMemory } from "../../cache/memCache";
import { createHomepageLink, createRepoLink, createNpmLink } from "./linkCreators";
import StalenessWarning from "../warnings/StalenessWarning";
import DownloadsWarning from "../warnings/DownloadsWarning";

export function createPackageDetailsHoverMenu() {
    return languages.registerHoverProvider(
       { scheme: 'file', language: 'json', pattern: '**/package.json'},
       {
        provideHover(document, position, token) {
            if (!document.fileName.endsWith('package.json')) {
                return null;
            }

            const line = document.lineAt(position.line);
            const lineText = line.text;
            const match = lineText.match(/"([^"]+)"\s*:\s*"([^"]+)"/);
            if (!match) {
                return null;
            }

            const [fullMatch, packageName, version] = match;

            const cachedPackage = getRepoFromMemory(packageName);
            if (!cachedPackage) {
                return null;
            }

            if (packageName === 'dependencies' || packageName === 'devDependencies') {
                return null;
            }

            const startChar = lineText.indexOf('"' + packageName);
            const endChar = lineText.indexOf(version) + version.length;
            const hoverRange = new Range(
                position.line,
                startChar,
                position.line,
                endChar
            );

            if (!hoverRange.contains(position)) {
                return null;
            }
            
            const markdown = new MarkdownString();
            markdown.supportThemeIcons = true;
            markdown.isTrusted = true;
            const cleanVersion = version.replace(/^[\^~]/, '');
            console.log(cachedPackage.time[cleanVersion], cleanVersion);
            const numberOfDependencies = Object.keys(cachedPackage.versions[cleanVersion].dependencies || {}).length;
            const depWarning = new DependencyWarning(numberOfDependencies);
            const staleness = new StalenessWarning(cachedPackage.time[cleanVersion]);
            const temp_dl = 10000;
            const dlWarning = new DownloadsWarning(temp_dl);

            markdown.appendMarkdown(`**${cachedPackage.name}** &nbsp; &nbsp; &nbsp; ${createRepoLink(cachedPackage.repository.url)}  ${createHomepageLink(cachedPackage.homepage)}  ${createNpmLink(packageName)}\n\n`);
            markdown.appendMarkdown(`---\n\n`);
            markdown.appendMarkdown(cachedPackage.description + '\n\n');
            markdown.appendMarkdown(`${staleness.icon} v${cleanVersion} • ${depWarning.icon} ${numberOfDependencies} deps • ${dlWarning.icon} ${temp_dl} downloads/week\n\n`);
            const showTips = depWarning.showWarning() || staleness.showWarning() || dlWarning.showWarning();
            if (showTips) {
                markdown.appendMarkdown(`---\n\n`);
                if (depWarning.showWarning()) {
                    markdown.appendMarkdown(depWarning.getWarning());
                }
                if (staleness.showWarning()) {
                    markdown.appendMarkdown(staleness.getWarning());
                }
                if (dlWarning.showWarning()) {
                    markdown.appendMarkdown(dlWarning.getWarning());
                }
            }
            
            return new Hover(markdown, hoverRange);
        }
       } 
    );
}
