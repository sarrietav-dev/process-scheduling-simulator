import type {
  ProcessStatistic,
  SchedulingStrategy,
} from "../SchedulingStrategy";
import type Process from "../Process";
import _ from "lodash";
import { narrowNumber } from "@/utils/narrowNumber";


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
    return _.meanBy(this.statsByProcess, "waitTime");
  }

  execute(): ProcessStatistic[] {
    this._processes.forEach(() => {
      const startTime = this.lastEndTime;

      if (startTime === undefined) throw Error();

      const unattendedProcesses = this.spawnProcesses(
        narrowNumber(startTime)
      ).filter((process) => !this.attendedProcesses.includes(process));

      const highestPriority = _.minBy(
        unattendedProcesses,
        "priority"
      )?.priority;

      const priorityDuplicates = unattendedProcesses.filter(
        (process) => process.priority === highestPriority
      );

      const highestPriorityProcess = priorityDuplicates.length
        ? _.minBy(priorityDuplicates, "arrivalTime")
        : priorityDuplicates[0];

      if (highestPriorityProcess === undefined) throw Error();

      const endTime = narrowNumber(startTime) + highestPriorityProcess.cpuTime;
      const waitTime =
        narrowNumber(startTime) - highestPriorityProcess.arrivalTime;

      this.statsByProcess.push({
        process: highestPriorityProcess,
        startTime: [narrowNumber(startTime)],
        endTime: [narrowNumber(endTime)],
        waitTime,
      });
      this.attendedProcesses.push(highestPriorityProcess);
    });

    return this.statsByProcess;
  }

  private get lastEndTime() {
    return this.statsByProcess.length === 0
      ? _.minBy(this._processes, "arrivalTime")?.arrivalTime
      : _.last(this.statsByProcess)?.endTime;
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
