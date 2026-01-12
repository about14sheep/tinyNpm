import { WarningLevel } from "./types";

export default class DownloadsWarning {
    private detailsLink: string = "";
    private warningLevel: WarningLevel;
    private passingCount: number = 10000;
    private warningCount: number = 500;
    public icon: string;

    constructor(downloadCount: number) {
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

    public showWarning() {
        return this.warningLevel !== WarningLevel.PASS;
    }

    public getWarning() {
        return `${this.icon} *Limited adoption means less community security review* [Learn more](${this.detailsLink})`;
    }
}