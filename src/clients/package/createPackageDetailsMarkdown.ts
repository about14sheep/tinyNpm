import { MarkdownString } from "vscode";
import DependencyWarning from "../warnings/DependencyWarning";
import { createHeader } from "../util/hoverMenuHeader";
import { getDownloadsFromMemory, getRepoFromMemory } from "../../cache/memCache";
import StalenessWarning from "../warnings/StalenessWarning";
import DownloadsWarning from "../warnings/DownloadsWarning";

export function createPackageDetailsMarkdown(packageName: string, version: string): MarkdownString {
    const cachedPackage = getRepoFromMemory(packageName);
    const markdown = new MarkdownString();
    markdown.supportThemeIcons = true;
    markdown.isTrusted = true;

    const cleanVersion = version.replace(/^[\^~]/, '');
    const numberOfDependencies = Object.keys(cachedPackage.versions[cleanVersion].dependencies || {}).length;
    const depWarning = new DependencyWarning(numberOfDependencies);
    const staleness = new StalenessWarning(cachedPackage.time[cleanVersion]);
    const temp_dl = getDownloadsFromMemory(packageName) || -1;
    const dlWarning = new DownloadsWarning(temp_dl);
    const repourl = cachedPackage.repository.url;
    const homepageUrl = cachedPackage.homepage;

    markdown.appendMarkdown(createHeader(repourl, homepageUrl, packageName));
    markdown.appendMarkdown(`${staleness.icon} v${cleanVersion} • ${depWarning.icon} ${numberOfDependencies} deps ${dlWarning.getDownloads()}\n\n`);
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

    return markdown;
}