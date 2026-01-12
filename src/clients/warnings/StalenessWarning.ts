import { WarningLevel } from "./types";

export default class StalenessWarning {
    private detailsLink: string = "";
    private release: Date;
    private daysSince: number;
    private warningLevel: WarningLevel;
    public icon: string;

    constructor(releaseStr: string) {
        this.release = new Date(releaseStr);
        this.daysSince = this.getDaysSince();
        this.warningLevel = this.setWarningLevel();
        this.icon = this.setIcon(this.warningLevel);
    }

    private getDaysSince() {
        const now = new Date();
        const msPerDay = 1000 * 60 * 60 * 24;
        return Math.floor((now.getTime() - this.release.getTime()) / msPerDay);
    }

    private setWarningLevel(): WarningLevel {
        if (this.daysSince <= 180) {
            return WarningLevel.PASS;
        } else if (this.daysSince <= 730) {
            return WarningLevel.WARNING;
        } else {
            return WarningLevel.ERROR;
        }
    }

    private setIcon(level: WarningLevel): string {
        let icon = "";
        switch (level) {
            case WarningLevel.PASS:
                icon = "\u{1F195}";
                break;
            case WarningLevel.WARNING:
                icon = "\u{23F0}";
                break;
            default:
                icon = "\u{1F480}";
                break;
        }

        return icon;
    }

    public showWarning() {
        return this.warningLevel !== WarningLevel.PASS;
    }

    public getWarning() {
        return `${this.icon} *Outdated packages may lack recent security fixes* [Learn more](${this.detailsLink})\n\n`;
    }
}