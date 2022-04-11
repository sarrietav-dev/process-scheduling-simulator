import Process from '../../Process';
import PriorityStrategy from '../PriorityStrategy';
import type { ProcessStatistic } from '../../SchedulingStrategy';

describe('The algorithm works correctly', () => {
	const results: ProcessStatistic[] = [
		{
			process: new Process('P1', 5, 0, 1),
			startTime: 0,
			endTime: 5,
			waitTime: 0
		},
		{
			process: new Process('P3', 8, 2, 1),
			startTime: 5,
			endTime: 13,
			waitTime: 3
		},
		{
			process: new Process('P2', 3, 1, 2),
			startTime: 13,
			endTime: 16,
			waitTime: 12
		},
		{
			process: new Process('P4', 6, 3, 3),
			startTime: 16,
			endTime: 22,
			waitTime: 13
		}
	];

	test('when ordered', () => {
		const processes: Process[] = [
			new Process('P1', 5, 0, 1),
			new Process('P2', 3, 1, 2),
			new Process('P3', 8, 2, 1),
			new Process('P4', 6, 3, 3)
		];

		const strategy = new PriorityStrategy(processes);

		expect(strategy.execute()).toEqual(results);
	});

	test('when unordered', () => {
		const processes: Process[] = [
			new Process('P3', 8, 2, 1),
			new Process('P4', 6, 3, 3),
			new Process('P2', 3, 1, 2),
			new Process('P1', 5, 0, 1)
		];

		const strategy = new PriorityStrategy(processes);

		expect(strategy.execute()).toEqual(results);
	});
});

test("")

test('throws an error when not defining a priority in a process', () => {
	const processes: Process[] = [
		new Process('A', 3, 0),
		new Process('B', 3, 1),
		new Process('C', 2, 2),
		new Process('D', 4, 4)
	];

	expect(() => new PriorityStrategy(processes)).toThrow(
		'Every process must have a priority defined'
	);
});
