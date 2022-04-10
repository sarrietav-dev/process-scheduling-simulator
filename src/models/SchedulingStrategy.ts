import type Process from './Process';

export interface SchedulingStrategy {
	processes: Process[];

	run(): ProcessStatistic[];
}

export interface ProcessStatistic {
	process: Process;
	startTime: number;
	endTime: number;
	waitTime: number;
}
