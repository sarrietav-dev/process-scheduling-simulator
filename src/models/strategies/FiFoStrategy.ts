import type { ProcessStatistic, SchedulingStrategy } from '../SchedulingStrategy';
import type Process from '../Process';
import lodash from 'lodash';

class FiFoStrategy implements SchedulingStrategy {
	readonly processes: Process[];
	private statsByProcess: ProcessStatistic[] = [];
	private attendedProcesses: Process[] = [];

	constructor(processes: Process[]) {
		this.processes = processes;
	}

	run(): ProcessStatistic[] {
		this.processes.forEach(() => {
			const startTime = this.lastEndTime;

			const process = lodash.minBy(this.unattendedProcesses, 'arrivalTime');

			const endTime = startTime + process.cpuTime;
			const waitTime = startTime - process.arrivalTime;

			this.statsByProcess.push({ process, startTime, endTime, waitTime });
			this.attendedProcesses.push(process);
		});

		return this.statsByProcess;
	}

	private get lastEndTime() {
		return this.statsByProcess.length === 0
			? lodash.minBy(this.processes, 'arrivalTime').arrivalTime
			: this.statsByProcess.at(-1).endTime;
	}

	private get unattendedProcesses() {
		return this.processes.filter((process) => !this.attendedProcesses.includes(process));
	}
}

export default FiFoStrategy;
