import { WarningLevel } from "./types";

export default class DownloadsWarning {
    private totalDownloads: number;
    private warningLevel: WarningLevel;
    private passingCount: number = 10000;
    private warningCount: number = 500;
    public icon: string;

    constructor(downloadCount: number) {
        this.totalDownloads = downloadCount;
        this.warningLevel = this.setWarningLevel(downloadCount);
        this.icon = this.setIcon(this.warningLevel);
    }

    private setIcon(level: WarningLevel) {
        let icon = "";
        switch (level) {
            case WarningLevel.PASS:
                icon = "\u{1F525}";
                break;
            case WarningLevel.WARNING:
                icon = "\u{1F4C9}";
                break;
            default:
                icon = "\u{1F997}";
                break;
        }

        return icon;
    }

    private setWarningLevel(count: number) {
        if (count >= this.passingCount) {
            return WarningLevel.PASS;
        } else if (count >= this.warningCount) {
            return WarningLevel.WARNING;
        } else {
            return WarningLevel.ERROR;
        }
    }

    private formatDownloads(downloads: number): string {
        if (downloads >= 1000000) {
            return `${(downloads / 1000000).toFixed(1)}M`;
        } else if (downloads >= 1000) {
            return `${(downloads / 1000).toFixed(1)}K`;
        } else {
            return downloads.toString();
        }
    }

    public showWarning() {
        return this.warningLevel !== WarningLevel.PASS;
    }

    public getWarning() {
        if (!this.totalDownloads || this.totalDownloads < 0) {
            return "";
        }
        return `${this.icon} *Limited adoption means less community security review*`;
    }

    public getDownloads() {
        if (!this.totalDownloads || this.totalDownloads < 0) {
            return "";
        }

        return `• ${this.icon} ${this.formatDownloads(this.totalDownloads)} weekly`;
    }
}