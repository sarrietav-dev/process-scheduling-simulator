import _ from "lodash";
import type Process from "../Process";
import type {
  ProcessStatistic,
  SchedulingStrategy,
} from "../SchedulingStrategy";
import ProcessStatisticsWrapper from "./utils/ProcessStatisticsWrapper";
import RemainingCPUTracker, {
  type ProcessCPUTracker,
} from "./utils/RemainingCPUTracker";

class SRTFStrategy implements SchedulingStrategy {
  private _processes: Process[] = [];
  private processStatisticsWrapper!: ProcessStatisticsWrapper;
  private attendedProcesses: Process[] = [];
  private remainingCpuTracker!: RemainingCPUTracker;
  private tick = 0;

  constructor(processes: Process[]) {
    this.processes = processes;
  }

  private set processes(processes: Process[]) {
    this._processes = _.sortBy(processes, (o) => o.arrivalTime);
    this.processStatisticsWrapper = new ProcessStatisticsWrapper(
      this._processes
    );
    this.remainingCpuTracker = new RemainingCPUTracker(this._processes);
  }

  setProcesses(processes: Process[]): void {
    this.processes = processes;
  }

  execute(): ProcessStatistic[] {
    while (this.attendedProcesses.length < this._processes.length) {
      const process = this.getCurrentProcess();

      try {
        const nextProcess = this.getNextRelativeProcess(process);

        const startTime = this.tick;

        this.processStatisticsWrapper.appendStartTime(startTime, process);

        const remainingCpuTime =
          this.remainingCpuTracker.get(process).remainingCpuTime;

        const doesFinish =
          startTime + remainingCpuTime <= nextProcess.arrivalTime;

        const nextRemainingCpuTime =
          this.remainingCpuTracker.get(nextProcess).remainingCpuTime;

        const isShorter = nextRemainingCpuTime > remainingCpuTime;

        if (!isShorter && !doesFinish) {
          this.tick = nextProcess.arrivalTime;
          this.remainingCpuTracker.decrement(this.tick - startTime, process);
        } else {
          this.tick = startTime + remainingCpuTime;
          this.remainingCpuTracker.decrement(remainingCpuTime, process);
          this.attendedProcesses.push(process);
        }

        this.processStatisticsWrapper.appendEndTime(this.tick, process);
      } catch (e) {
        this.endLastProcess(process);
      }
    }

    return this.processStatisticsWrapper.statistics;
  }

  private getCurrentProcess() {
    const spawnProcesses = this.getSpawnProcesses();
    const unattendedProcesses = this.getUnattendedProcessesFrom(spawnProcesses);
    try {
      return this.getShortestTimeFrom(unattendedProcesses);
    } catch (e) {
      return unattendedProcesses[0];
    }
  }

  private getSpawnProcesses() {
    return this._processes.filter(
      (process) => process.arrivalTime <= this.tick
    );
  }

  private getUnattendedProcessesFrom(processes: Process[]) {
    return processes.filter(
      (process) => !this.attendedProcesses.includes(process)
    );
  }

  private getShortestTimeFrom(processes: Process[]) {
    const processTrackers = this.remainingCpuTracker.tracker.filter((tracker) =>
      processes.includes(tracker.process)
    );

    let shortestTimeProcess = _.minBy(
      processTrackers,
      (o) => o.remainingCpuTime
    );

    if (!shortestTimeProcess) throw Error("highestPriorityProcess is null");

    const repetitions = this.getShortestTimeRepetitions(
      shortestTimeProcess.remainingCpuTime,
      processTrackers
    );

    if (repetitions.length > 1) {
      shortestTimeProcess = _.minBy(repetitions, (o) => o.remainingCpuTime);

      if (!shortestTimeProcess) throw Error("highestPriorityProcess is null");
    }

    return shortestTimeProcess.process;
  }

  private getShortestTimeRepetitions(
    remainingTime: number,
    processes: ProcessCPUTracker[]
  ) {
    return processes.filter(
      (process) => process.remainingCpuTime === remainingTime
    );
  }

  private getNextRelativeProcess(process: Process): Process {
    const nextProcesses = this._processes.filter(
      (processItem) =>
        process.arrivalTime < processItem.arrivalTime &&
        !this.attendedProcesses.includes(processItem)
    );

    if (nextProcesses.length === 0) {
      const spawnProcesses = this.getSpawnProcesses();
      const unattendedProcesses =
        this.getUnattendedProcessesFrom(spawnProcesses);

      const unattendedProcessesWithoutCurrent = unattendedProcesses.filter(
        (processItem) => processItem !== process
      );

      if (unattendedProcessesWithoutCurrent.length === 0)
        throw new Error("This is the last process");

      return this.getShortestTimeFrom(unattendedProcessesWithoutCurrent);
    }

    const nextRelativeProcess = _.minBy(nextProcesses, (o) => o.arrivalTime);

    if (!nextRelativeProcess)
      throw new Error("The nextRelativeProcess is undefined");

    return nextRelativeProcess;
  }

  private endLastProcess(process: Process) {
    const startTime = this.tick;

    this.processStatisticsWrapper.appendStartTime(startTime, process);

    const remainingCpuTime =
      this.remainingCpuTracker.get(process).remainingCpuTime;

    this.tick = startTime + remainingCpuTime;
    this.remainingCpuTracker.decrement(remainingCpuTime, process);
    this.attendedProcesses.push(process);
    this.processStatisticsWrapper.appendEndTime(this.tick, process);
  }

  get waitTimeAverage(): number {
    if (this.attendedProcesses.length === 0) this.execute();
    return this.processStatisticsWrapper.getMeanWaitTime();
  }
}

export default SRTFStrategy;
