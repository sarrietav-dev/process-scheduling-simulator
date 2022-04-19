import type Process from "../Process";
import type {
  ProcessStatistic,
  SchedulingStrategy,
} from "../SchedulingStrategy";

class ExpPriorityStrategy implements SchedulingStrategy {
  private processes: Process[] = [];

  setProcesses(processes: Process[]): void {
    this.processes = processes;
  }

  get waitTimeAverage(): number {
    return 1;
  }

  execute(): ProcessStatistic[] {
    throw new Error("Method not implemented.");
  }
}

export default ExpPriorityStrategy;
