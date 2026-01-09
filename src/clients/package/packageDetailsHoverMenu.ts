import { Hover, languages, MarkdownString, Range } from "vscode";
import { getRepoFromMemory } from "../../cache/memCache";

function cleanRepoUrl(url: string) {
    if (url.startsWith('git+')) {
        url = url.substring(4);
    }

    if (url.startsWith('git://')) {
        url = url.replace('git://', 'https://');
    }

    if (url.endsWith('.git')) {
        url = url.substring(0, url.length - 4);
    }

    return url;
}

function createHomepageLink(url: string) {
    return `[$(home)](${url} "View Homepage") &nbsp;`;
}

function createRepoLink(url: string) {
    let repoHost = 'github';
    let repoText = 'on GitHub';
    if (!url.includes('github')) {
        repoHost = 'repo';
        repoText = 'Repository';
    }
    return `[$(${repoHost})](${cleanRepoUrl(url)} "View ${repoText}") &nbsp;`;
}

function createNpmLink(packageName: string) {
    return `[npm](https://npmjs.org/package/${packageName} "View on npm") &nbsp;`;
}

function getDependencyWarningLevel(depCount: number): { icon: string, color: string, message: string} {
    if (depCount === 0) {
        return { icon: 'pass', color: 'green', message: 'No dependencies'};
    } else if (depCount <= 10) {
        return { icon: 'pass', color: 'green', message: 'Low dependency count'};
    } else if (depCount <= 50) {
        return { icon: 'warning', color: 'yellow', message: 'Moderate dependencies'};
    } else {
        return { icon: 'error', color: 'red', message: 'High dependency count'};
    }
}

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
            const numberOfDependencies = Object.keys(cachedPackage.versions[cleanVersion].dependencies || {}).length;
            const depWarning = getDependencyWarningLevel(numberOfDependencies);

            markdown.appendMarkdown(`**${cachedPackage.name}** &nbsp; &nbsp; &nbsp; ${createRepoLink(cachedPackage.repository.url)}  ${createHomepageLink(cachedPackage.homepage)}  ${createNpmLink(packageName)}\n\n`);
            markdown.appendMarkdown(`---\n\n`);
            markdown.appendMarkdown(cachedPackage.description + '\n\n');
            markdown.appendMarkdown(`v${cleanVersion} • ${numberOfDependencies} deps $(${depWarning.icon}) • 10000 downloads/week\n\n`);
            if (depWarning.icon === 'warning' || depWarning.icon === 'error') {
                markdown.appendMarkdown(`---\n\n`);
                markdown.appendMarkdown(`$(${depWarning.icon}) *High dependency count increases risks.* [Learn more]()\n\n`);
            }
            
            return new Hover(markdown, hoverRange);
        }
       } 
    );
}