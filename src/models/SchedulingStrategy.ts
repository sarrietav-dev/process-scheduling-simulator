import type Process from './Process';

export interface SchedulingStrategy {
	processes: Process[];
	execute(): ProcessStatistic[];
	waitTimeAverage: number;
}

export interface ProcessStatistic {
	process: Process;
	startTime: number;
	endTime: number;
	waitTime: number;
}
