import type {
  ProcessStatistic,
  SchedulingStrategy,
} from "../SchedulingStrategy";
import type Process from "../Process";
import lodash from "lodash";

class SJFStrategy implements SchedulingStrategy {
  private _processes: Process[] = [];
  private attendedProcesses: Process[] = [];
  private statsByProcess: ProcessStatistic[] = [];

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

      const unattendedProcesses = this.spawnProcesses(startTime).filter(
        (process) => !this.attendedProcesses.includes(process)
      );

      const shortestCpuTimeProcess = lodash.minBy(
        unattendedProcesses,
        "cpuTime"
      );

      if (shortestCpuTimeProcess === undefined) throw Error();

      const endTime = startTime + shortestCpuTimeProcess.cpuTime;
      const waitTime = startTime - shortestCpuTimeProcess.arrivalTime;

      this.statsByProcess.push({
        process: shortestCpuTimeProcess,
        startTime,
        endTime,
        waitTime,
      });
      this.attendedProcesses.push(shortestCpuTimeProcess);
    });

    return this.statsByProcess;
  }

  private get lastEndTime() {
    return this.statsByProcess.length === 0
      ? lodash.minBy(this._processes, "arrivalTime")?.arrivalTime
      : this.statsByProcess.at(-1)?.endTime;
  }

  /**
   * Returns the processes that have been initialized in a certain timeframe.
   * @param currentTime timeframe upperbound
   * @private
   */
  private spawnProcesses(currentTime: number): Process[] {
    return this._processes.filter((process) => {
      return process.arrivalTime <= currentTime;
    });
  }
}

export default SJFStrategy;
