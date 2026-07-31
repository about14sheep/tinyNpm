import { Range } from "vscode";

interface HoverDecorationType {
    range: Range,
    packageName: string,
    depCount: number,
    downloads: number,
    currentVersion: string,
    age: number,
    latest: {
        version: string,
        release: string
    },
    safest: {
        version: string,
        release: string
    }
}

export const decorationRanges = new Map<number, HoverDecorationType>();