import type {
  ProcessStatistic,
  SchedulingStrategy,
} from "../SchedulingStrategy";
import type Process from "../Process";
import lodash from "lodash";

class FiFoStrategy implements SchedulingStrategy {
  private _processes: Process[] = [];
  private statsByProcess: ProcessStatistic[] = [];
  private attendedProcesses: Process[] = [];

  constructor(processes?: Process[]) {
    if (processes) this._processes = processes;
  }

  setProcesses(processes: Process[]): void {
    this._processes = processes;
  }

  get waitTimeAverage(): number {
    if (!this.statsByProcess.length) this.execute();
    return lodash.meanBy(this.statsByProcess, "waitTime");
  }

  execute(): ProcessStatistic[] {
    this._processes.forEach(() => {
      const startTime = this.lastEndTime;

      if (startTime === undefined) throw Error();

      const process = lodash.minBy(this.unattendedProcesses, "arrivalTime");

      if (process === undefined) throw Error();

      const endTime = startTime + process.cpuTime;
      const waitTime = startTime - process.arrivalTime;

      this.statsByProcess.push({ process, startTime, endTime, waitTime });
      this.attendedProcesses.push(process);
    });

    return this.statsByProcess;
  }

  private get lastEndTime() {
    return this.statsByProcess.length === 0
      ? lodash.minBy(this._processes, "arrivalTime")?.arrivalTime
      : this.statsByProcess.at(-1)?.endTime;
  }

  private get unattendedProcesses() {
    return this._processes.filter(
      (process) => !this.attendedProcesses.includes(process)
    );
  }
}

export default FiFoStrategy;
