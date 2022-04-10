import type { ProcessStatistic, SchedulingStrategy } from '../SchedulingStrategy';
import type Process from '../Process';
import lodash from 'lodash';

class SJFStrategy implements SchedulingStrategy {
	constructor(processes: Process[]) {
		this.processes = processes;
	}

	readonly processes: Process[];
	private attendedProcesses: Process[] = [];
	private statsByProcess: ProcessStatistic[] = [];

	execute(): ProcessStatistic[] {
		this.processes.forEach(() => {
			const startTime = this.lastEndTime;

			const unattendedProcesses = this.spawnProcesses(startTime).filter(
				(process) => !this.attendedProcesses.includes(process)
			);

			const shortestCpuTimeProcess = lodash.minBy(unattendedProcesses, 'cpuTime');

			const endTime = startTime + shortestCpuTimeProcess.cpuTime;
			const waitTime = startTime - shortestCpuTimeProcess.arrivalTime;

			this.statsByProcess.push({ process: shortestCpuTimeProcess, startTime, endTime, waitTime });
			this.attendedProcesses.push(shortestCpuTimeProcess);
		});

		return this.statsByProcess;
	}

	private get lastEndTime() {
		return this.statsByProcess.length === 0
			? lodash.minBy(this.processes, 'arrivalTime').arrivalTime
			: this.statsByProcess.at(-1).endTime;
	}

	/**
	 * Returns the processes that have been initialized in a certain timeframe.
	 * @param currentTime timeframe upperbound
	 * @private
	 */
	private spawnProcesses(currentTime: number): Process[] {
		return this.processes.filter((process) => {
			return process.arrivalTime <= currentTime;
		});
	}
}

export default SJFStrategy;
