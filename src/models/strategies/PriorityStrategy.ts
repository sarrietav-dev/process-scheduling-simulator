import type {
  ProcessStatistic,
  SchedulingStrategy,
} from "../SchedulingStrategy";
import type Process from "../Process";
import lodash from "lodash";

class PriorityStrategy implements SchedulingStrategy {
  private _processes: Process[] = [];
  private statsByProcess: ProcessStatistic[] = [];
  private attendedProcesses: Process[] = [];

  constructor(processes?: Process[]) {
    if (processes) {
      this.validatePriorityProperty(processes);
      this._processes = processes;
    }
  }

  setProcesses(processes: Process[]): void {
    this.validatePriorityProperty(processes);
    this._processes = processes;
  }

  private validatePriorityProperty(processes: Process[]) {
    if (processes.some((process) => process.priority === undefined))
      throw Error("Every process must have a priority defined");
  }

  get waitTimeAverage() {
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

      const highestPriority = lodash.minBy(
        unattendedProcesses,
        "priority"
      )?.priority;

      const priorityDuplicates = unattendedProcesses.filter(
        (process) => process.priority === highestPriority
      );

      const highestPriorityProcess = priorityDuplicates.length
        ? lodash.minBy(priorityDuplicates, "arrivalTime")
        : priorityDuplicates[0];

      if (highestPriorityProcess === undefined) throw Error();

      const endTime = startTime + highestPriorityProcess.cpuTime;
      const waitTime = startTime - highestPriorityProcess.arrivalTime;

      this.statsByProcess.push({
        process: highestPriorityProcess,
        startTime,
        endTime,
        waitTime,
      });
      this.attendedProcesses.push(highestPriorityProcess);
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

export default PriorityStrategy;
