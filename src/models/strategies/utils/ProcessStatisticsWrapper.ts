import type Process from "@/models/Process";
import type { ProcessStatistic } from "@/models/SchedulingStrategy";

class ProcessStatisticsWrapper {
  private statistics: ProcessStatistic[];

  constructor(processes: Process[]) {
    this.statistics = processes.map((process) => ({
      process,
      startTime: [],
      waitTime: 0,
      endTime: [],
    }));
  }

  public appendStartTime(time: number, process: Process) {
    const statistic = this.getStatistic(process);

    if (!statistic) throw new Error("The process isn't doesn't exist");

    statistic.startTime.push(time);

    return [...statistic.startTime];
  }

  public appendEndTime(time: number, process: Process) {
    const statistic = this.getStatistic(process);

    if (!statistic) throw new Error("The process isn't doesn't exist");

    statistic.endTime.push(time);

    return [...statistic.endTime];
  }

  private getStatistic(process: Process) {
    return this.statistics.find((statistic) => statistic.process === process);
  }
}

export default ProcessStatisticsWrapper;
