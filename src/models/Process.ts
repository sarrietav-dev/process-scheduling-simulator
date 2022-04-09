class Process {
	readonly name: string;
	readonly cpuTime: number;
	readonly arrivalTime: number;

	constructor(name: string, cpuTime: number, arrivalTime: number) {
		this.name = name;
		this.cpuTime = cpuTime;
		this.arrivalTime = arrivalTime;
	}
}

export default Process;
