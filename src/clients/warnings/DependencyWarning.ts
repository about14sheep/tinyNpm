import { WarningLevel } from "./types";

export default class DependencyWarning {
    private warningLevel: WarningLevel;
    private passingCount: number = 10;
    private warningCount: number = 50;
    public icon: string;

    constructor(count: number) {
        this.warningLevel = this.setWarningLevel(count);
        this.icon = this.setIcon(this.warningLevel);
    }

    private setIcon(level: WarningLevel): string {
        let icon = "";
        switch (level) {
            case WarningLevel.PASS:
                icon = '\u{2705}'; 
                break;
            case WarningLevel.WARNING:
                icon = '\u{26A0}\u{FE0F}';
                break;
            default:
                icon = '\u{274C}';
                break;
        }

        return icon;
    }

    private setWarningLevel(count: number): WarningLevel {
        if (count <= this.passingCount) {
           return WarningLevel.PASS; 
        } else if (count <= this.warningCount) {
            return WarningLevel.WARNING;
        } else {
            return WarningLevel.ERROR;
        }
    }

    public showWarning() {
        return this.warningLevel !== WarningLevel.PASS;
    }

    public getWarning() {
        return `${this.icon} *High dependency count increases risks.*\n\n`;
    }
}
