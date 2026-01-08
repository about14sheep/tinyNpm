import { Range } from "vscode";

interface HoverDecorationType {
    range: Range,
    packageName: string,
    latest: {
        version: string
    },
    safest: {
        version: string,
        release: string
    }
}

export const decorationRanges = new Map<number, HoverDecorationType>();