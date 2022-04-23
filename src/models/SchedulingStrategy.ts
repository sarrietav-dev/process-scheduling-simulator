import type Process from "./Process";

export interface SchedulingStrategy {
  execute(): ProcessStatistic[];
  setProcesses(processes: Process[]): void;
  waitTimeAverage: number;
}

export interface ProcessStatistic {
  process: Process;
  startTime: number[];
  endTime: number[];
  waitTime: number;
}
