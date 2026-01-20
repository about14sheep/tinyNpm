import path from "node:path";
import { homedir } from "node:os";
import { access, readFile } from "node:fs/promises";
import { getNpmrcFromCache, storeNpmrc } from "../../cache/npmrcCache";
import { NpmRC } from "../../cache/types";

function parseNpmrc(content: string) {
    const config: Record<string, string> = {};

    content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
            return;
        }

        const [key, ...valueParts] = trimmed.split('=');
        config[key.trim()] = valueParts.join('=').trim();
    });
    
    return config;
}

async function parseNpmecFile(path: string) {
    try {
        await access(path);

        const content = await readFile(path, 'utf-8');
        return parseNpmrc(content);
    } catch (err) {
        return undefined;
    }
}

async function findNpmrc(wsRoot: string): Promise<NpmRC> {
    const userNpmrc = path.join(homedir(), '.npmrc');
    const projectNpmrc = path.join(wsRoot, '.npmrc');
    const userconfig = await parseNpmecFile(userNpmrc) || {};
    const projectConfig = await parseNpmecFile(projectNpmrc) || {};

    const mergedConfig = {
        ...userconfig,
        ...projectConfig
    };

    const npmRc = {
        merged: mergedConfig,
        sources: {
            user: userconfig,
            project: projectConfig
        }
    };

    storeNpmrc(wsRoot, npmRc);

    return npmRc;
}

export async function getNpmRc(wsRoot: string): Promise<NpmRC> {
    const npmRc = getNpmrcFromCache(wsRoot);
    if (!npmRc) {
        return await findNpmrc(wsRoot);
    }

    return npmRc;
}
