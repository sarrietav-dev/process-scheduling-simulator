import type Process from "@/models/Process";

class RemainingCPUTracker {
  private tracker: { process: Process; remainingCpuTime: number }[];

  constructor(processes: Process[]) {
    this.tracker = processes.map((process) => ({
      process: process,
      remainingCpuTime: process.cpuTime,
    }));
  }

  public decrement(amount: number, process: Process) {
    const trackerItem = this.getTracker(process);

    trackerItem.remainingCpuTime -= amount;
  }

  private getTracker(process: Process) {
    const trackerItem = this.tracker.find((item) => item.process === process);

    if (!trackerItem) throw new Error("The process doesn't exist");

    return trackerItem;
  }

  public get(process: Process) {
    return { ...this.getTracker(process) };
  }
}

export default RemainingCPUTracker;
