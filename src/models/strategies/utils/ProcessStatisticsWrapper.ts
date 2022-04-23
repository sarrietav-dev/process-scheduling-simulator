import type Process from "@/models/Process";
import type { ProcessStatistic } from "@/models/SchedulingStrategy";
import _ from "lodash";

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

    statistic.startTime.push(time);

    return [...statistic.startTime];
  }

  private getStatistic(process: Process) {
    const statistic = this.statistics.find(
      (statistic) => statistic.process === process
    );

    if (!statistic) throw new Error("The process isn't doesn't exist");

    return statistic;
  }

  public appendEndTime(time: number, process: Process) {
    const statistic = this.getStatistic(process);

    statistic.endTime.push(time);

    return [...statistic.endTime];
  }

  public getMeanWaitTime() {
    for (const stat of this.statistics) this.setWaitTime(stat.process);

    return _.meanBy(this.statistics, (o) => o.waitTime);
  }

  private setWaitTime(process: Process) {
    const statistic = this.getStatistic(process);

    const [firstStartTime, ...startTimes] = statistic.startTime;

    const initialWaitTime = firstStartTime - process.arrivalTime;

    const endTimes = statistic.endTime.slice(-1);

    const restWaitTime = startTimes.reduce(
      (sum, time, index) => sum + (time - endTimes[index]),
      0
    );

    statistic.waitTime = initialWaitTime + restWaitTime;
  }
}

export default ProcessStatisticsWrapper;
