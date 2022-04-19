import type Process from "../Process";
import type {
  ProcessStatistic,
  SchedulingStrategy,
} from "../SchedulingStrategy";
import _ from "lodash";

class ExpPriorityStrategy implements SchedulingStrategy {
  private _processes: Process[] = [];
  private processStatistics: ProcessStatistic[] = [];
  private unattendedProcesses: Process[] = [];
  private remainingCPUTimeTracker: {
    processName: string;
    remainingCpuTime: number;
  }[] = [];
  private tick = 0;

  constructor(processes?: Process[]) {
    if (processes) this.processes = processes;
  }

  setProcesses(processes: Process[]): void {
    this.processes = processes;
  }

  set processes(value: Process[]) {
    this._processes = value;
    this.remainingCPUTimeTracker = value.map((process) => ({
      processName: process.name,
      remainingCpuTime: process.cpuTime,
    }));
    this.processStatistics = value.map((process) => ({
      process,
      startTime: [],
      waitTime: 0,
      endTime: [],
    }));
  }

  get waitTimeAverage(): number {
    return 1;
  }

  execute(): ProcessStatistic[] {
    let lastAttendedProcess: Process | undefined;

    while (this.unattendedProcesses.length !== 0) {
      const spawnProcesses = this.getSpawnProcesses();

      const unattendedProcesses = this.getUnattendedProcesses(spawnProcesses);

      const highestPriorityProcess =
        this.getHighestPriority(unattendedProcesses);

      if (lastAttendedProcess) {
        if (highestPriorityProcess.name !== lastAttendedProcess.name) {
          const lastAttendedProcessIndex = this.processStatistics.findIndex(
            (statistic) => statistic.process.name === lastAttendedProcess?.name
          );

          // TODO: Populate processStatistics
          //    - Keep track of the last process attended, and add the current tick to their endTime Arra
          //    - Append their startTimes

          // FIXME: Make endTime an array
          // this.processStatistics[lastAttendedProcessIndex].endTime = [
          //   ...this.processStatistics[lastAttendedProcessIndex].endTime,
          //   this.tick,
          // ];
        }
      }

      const remainingTime = this.decreaseRemainingTime(highestPriorityProcess);

      if (remainingTime === 0) {
        // TODO: Calculate the watTime here
        this.unattendedProcesses.push(highestPriorityProcess);
      }

      lastAttendedProcess = highestPriorityProcess;

      this.nextTick();
    }

    return this.processStatistics;
  }

  private getUnattendedProcesses(spawnProcesses: Process[]): Process[] {
    return spawnProcesses.filter(
      (process) => !this.unattendedProcesses.includes(process)
    );
  }

  private getSpawnProcesses(): Process[] {
    return this._processes.filter(
      (process) => process.arrivalTime <= this.tick
    );
  }

  private getHighestPriority(processes: Process[]): Process {
    const highestPriorityProcess = _.minBy(processes, "priority");

    if (!highestPriorityProcess) throw Error("highestPriorityProcess is null");

    const duplicatedPriorities = processes.filter(
      (process) => process.priority === highestPriorityProcess.priority
    );

    if (duplicatedPriorities.length > 1) {
      return _.minBy(duplicatedPriorities, "arrivalTime")!;
    }

    return highestPriorityProcess;
  }

  private decreaseRemainingTime(process: Process) {
    const processTrackerIndex = this.remainingCPUTimeTracker.findIndex(
      (processTracker) => process.name === processTracker.processName
    );

    return --this.remainingCPUTimeTracker[processTrackerIndex].remainingCpuTime;
  }

  private nextTick() {
    this.tick++;
  }
}

export default ExpPriorityStrategy;
