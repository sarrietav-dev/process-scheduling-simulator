import type { ProcessStatistic, SchedulingStrategy } from '../SchedulingStrategy';
import type Process from '../Process';

class PriorityStrategy implements SchedulingStrategy {
	processes: Process[];
	waitTimeAverage: number;

	constructor(processes: Process[]) {
		if (processes.some((process) => process.priority === undefined))
			throw Error('Every process must have a priority defined');
		this.processes = processes;
	}

	execute(): ProcessStatistic[] {
		return [];
	}
}

export default PriorityStrategy;
