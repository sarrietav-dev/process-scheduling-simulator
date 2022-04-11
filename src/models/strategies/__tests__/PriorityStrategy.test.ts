import Process from '../../Process';
import PriorityStrategy from '../PriorityStrategy';

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
