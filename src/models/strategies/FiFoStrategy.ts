import type {
  ProcessStatistic,
  SchedulingStrategy,
} from "../SchedulingStrategy";
import type Process from "../Process";
import _ from "lodash";

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
    return _.meanBy(this.statsByProcess, "waitTime");
  }

  execute(): ProcessStatistic[] {
    this._processes.forEach(() => {
      const startTime = this.lastEndTime;

      if (startTime === undefined || Array.isArray(startTime)) throw Error();

      const process = _.minBy(this.unattendedProcesses, "arrivalTime");

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
      ? _.minBy(this._processes, "arrivalTime")?.arrivalTime
      : _.last(this.statsByProcess)?.endTime;
  }

  private get unattendedProcesses() {
    return this._processes.filter(
      (process) => !this.attendedProcesses.includes(process)
    );
  }
}

export default FiFoStrategy;
