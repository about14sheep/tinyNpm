import { createRepoLink, createHomepageLink, createNpmLink } from "./linkCreators";

export function createHeader(repoUrl: string, homepage: string, packageName: string) {
    return `**${packageName}** &nbsp; &nbsp; &nbsp; ${createRepoLink(repoUrl)}  ${createHomepageLink(homepage)}  ${createNpmLink(packageName)}\n\n---\n\n`; 
}