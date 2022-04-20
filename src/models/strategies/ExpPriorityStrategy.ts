import type Process from "../Process";
import type {
  ProcessStatistic,
  SchedulingStrategy,
} from "../SchedulingStrategy";
import _ from "lodash";

// TODO: Refactor processStatistics to be better iterable.

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

    while (this.unattendedProcesses.length !== this._processes.length) {
      const spawnProcesses = this.getSpawnProcesses();

      const unattendedProcesses = this.getUnattendedProcesses(spawnProcesses);

      const highestPriorityProcess =
        this.getHighestPriority(unattendedProcesses);

      if (lastAttendedProcess) {
        if (highestPriorityProcess !== lastAttendedProcess) {
          this.addStopToPreviousProcess(lastAttendedProcess);
        }
      }

      const currentProcessStats = this.processStatistics.find(
        (stat) => stat.process === highestPriorityProcess
      )!;

      // If first time running
      if (currentProcessStats.startTime.length === 0) {
        currentProcessStats.startTime.push(this.tick);
      }

      // Add another start time if the process was suspended before.
      if (currentProcessStats.endTime.length > 0) {
        currentProcessStats?.startTime.push(this.tick);
      }

      const remainingTime = this.decreaseRemainingTime(highestPriorityProcess);

      if (remainingTime === 0) {
        // FIXME: waitTime === NaN
        currentProcessStats.waitTime = this.calculateWaitTimeOfProcess(
          highestPriorityProcess
        );

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

  private addStopToPreviousProcess(lastAttendedProcess: Process) {
    const lastAttendedProcessIndex = this.processStatistics.findIndex(
      (statistic) => statistic.process.name === lastAttendedProcess?.name
    );

    this.processStatistics[lastAttendedProcessIndex].endTime = [
      ...this.processStatistics[lastAttendedProcessIndex].endTime,
      this.tick,
    ];
  }

  private decreaseRemainingTime(process: Process) {
    const processTrackerIndex = this.remainingCPUTimeTracker.findIndex(
      (processTracker) => process.name === processTracker.processName
    );

    return --this.remainingCPUTimeTracker[processTrackerIndex].remainingCpuTime;
  }

  private calculateWaitTimeOfProcess(process: Process) {
    const processStats = this.processStatistics.find(
      (stat) => stat.process === process
    )!;

    const initialWaitTime = process.arrivalTime - processStats.startTime[0];

    // Has the process been suspended before?
    if (processStats.endTime.length > 1) {
      const startTimesWithoutFirst = processStats.startTime.slice(1);

      const suspendedWaitTimes = startTimesWithoutFirst.reduce(
        (prev, current, index) =>
          prev + (current + processStats.endTime[index]),
        0
      );

      return initialWaitTime + suspendedWaitTimes;
    }

    return initialWaitTime;
  }

  private nextTick() {
    this.tick++;
  }
}

// 0, 4, 8 / 2, 6, 9

export default ExpPriorityStrategy;
