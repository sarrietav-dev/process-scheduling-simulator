import type Process from './Process';

export interface SchedulingStrategy {
	processes: Process[];

	run(): { process: Process; startTime: number; endTime: number; waitTime: number }[];
}
