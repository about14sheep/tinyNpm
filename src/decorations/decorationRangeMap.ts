import { Range } from "vscode";

interface HoverDecorationType {
    range: Range,
    packageName: string,
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