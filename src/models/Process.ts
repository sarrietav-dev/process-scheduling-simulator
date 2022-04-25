class Process {
  readonly name: string;
  readonly cpuTime: number;
  readonly arrivalTime: number;
  readonly priority?: number;

  constructor(
    name: string,
    cpuTime: number,
    arrivalTime: number,
    priority = 1
  ) {
    this.name = name;
    this.cpuTime = cpuTime;
    this.arrivalTime = arrivalTime;
    this.priority = priority;
  }
}

export default Process;
