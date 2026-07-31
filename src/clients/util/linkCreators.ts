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

export function createHomepageLink(url: string) {
    return `[$(home)](${url} "View Homepage") &nbsp;`;
}

export function createRepoLink(url: string) {
    let repoHost = 'github';
    let repoText = 'on GitHub';
    if (!url.includes('github')) {
        repoHost = 'repo';
        repoText = 'Repository';
    }
    return `[$(${repoHost})](${cleanRepoUrl(url)} "View ${repoText}") &nbsp;`;
}

export function createNpmLink(packageName: string) {
    return `[npm](https://npmjs.org/package/${packageName} "View on npm") &nbsp;`;
}

export function createSocketLink(packageName: string) {
    return `[$(shield)](https://socket.dev/npm/package/${packageName} "View on socket.dev") &nbsp;`;
}