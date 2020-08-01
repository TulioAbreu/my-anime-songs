import Ora from "ora";

export class Progress {
    spinner: Ora.Ora;
    taskSize: number;
    currentProgress: number;

    constructor(taskName: string, taskSize: number) {
        this.spinner = Ora(taskName);
        this.taskSize = taskSize;
        this.currentProgress = 0;
    }

    start(): void {
        this.spinner.start();
    }

    progress(): void {
        this.currentProgress ++;

        const percentage = (100 * this.currentProgress) / this.taskSize;
        this.spinner.prefixText = `${percentage.toFixed(1)}%`;
    }

    finish(): void {
        this.spinner.succeed();
    }
}
