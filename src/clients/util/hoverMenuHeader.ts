import { createRepoLink, createHomepageLink, createNpmLink, createSocketLink } from "./linkCreators";

export function createHeader(repoUrl: string, homepage: string, packageName: string) {
    return `**${packageName}** &nbsp; &nbsp; &nbsp;  ${createRepoLink(repoUrl)}  ${createSocketLink(packageName)}  ${createHomepageLink(homepage)}  ${createNpmLink(packageName)}\n\n---\n\n`; 
}