import type Process from "./Process";

export interface SchedulingStrategy {
  execute(): ProcessStatistic[];
  setProcesses(processes: Process[]): void;
  waitTimeAverage: number;
}

export interface ProcessStatistic {
  process: Process;
  startTime: number | number[];
  endTime: number | number[];
  waitTime: number;
}
