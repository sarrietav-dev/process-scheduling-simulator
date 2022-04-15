import { defineStore } from "pinia";
import type { SchedulingStrategy } from "@/models/SchedulingStrategy";
import type Process from "@/models/Process";
import FiFoStrategy from "@/models/strategies/FiFoStrategy";

class Scheduler {
  constructor(private _strategy: SchedulingStrategy) {}

  set strategy(value: SchedulingStrategy) {
    this._strategy = value;
  }

  set processes(processes: Process[]) {
    this._strategy.setProcesses(processes);
  }

  runScheduler() {
    return this._strategy.execute();
  }
}

export const useScheduler = defineStore({
  id: "scheduler",
  state: () => {
    return new Scheduler(new FiFoStrategy());
  },
  actions: {
    setProcesses(processes: Process[]) {
      this.processes = processes;
    },
    setStrategy(strategy: SchedulingStrategy) {
      this.strategy = strategy;
    },
  },
});
