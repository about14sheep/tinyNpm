import { NpmRC } from "../../cache/types";

export function getRegistryForPackage(name: string, config: NpmRC): string {
    if (name.startsWith('@')) {
        const scope = name.split('/')[0];
        const scopedRegistry = config.merged[`${scope}:registry`];
        if (scopedRegistry) {
            return scopedRegistry;
        }
    }

    return config.merged['registry'] || 'https://registry.npmjs.org';
}

export function getAuthTokenForRegistry(registry: string, config: NpmRC): string {
    const registryHost = new URL(registry).host;
    return config.merged[`//${registryHost}/:_authToken`];
}
