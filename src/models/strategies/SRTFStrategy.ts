import _ from "lodash";
import type Process from "../Process";
import type {
  ProcessStatistic,
  SchedulingStrategy,
} from "../SchedulingStrategy";
import ProcessStatisticsWrapper from "./utils/ProcessStatisticsWrapper";
import RemainingCPUTracker from "./utils/RemainingCPUTracker";

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
    throw new Error("Method not implemented.");
  }

  get waitTimeAverage(): number {
    return 0;
  }
}

export default SRTFStrategy;
