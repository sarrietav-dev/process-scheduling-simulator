import type { ProcessStatistic, SchedulingStrategy } from '../SchedulingStrategy';
import type Process from '../Process';

class FiFoStrategy implements SchedulingStrategy {
	constructor(processes: Process[]) {
		this.processes = processes;
	}

	readonly processes: Process[];

	run(): ProcessStatistic[] {
		let waitTimes: { process: Process; startTime: number; endTime: number; waitTime: number }[] =
			[];

		this.processes.forEach((process) => {
			const startTime = waitTimes.length === 0 ? process.arrivalTime : waitTimes.at(-1).endTime;
			const endTime = startTime + process.cpuTime;
			const waitTime = startTime - process.arrivalTime;

			waitTimes = [...waitTimes, { process, startTime, endTime, waitTime }];
		});

		return waitTimes;
	}
}

export default FiFoStrategy;
