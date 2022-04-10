import type { SchedulingStrategy } from '../SchedulingStrategy';
import type Process from '../Process';

class SJFStrategy implements SchedulingStrategy {
	constructor(processes: Process[]) {
		this.processes = processes;
	}

	processes: Process[];

	run(): { process: Process; startTime: number; endTime: number; waitTime: number }[] {
		return [];
	}
}

export default SJFStrategy;
