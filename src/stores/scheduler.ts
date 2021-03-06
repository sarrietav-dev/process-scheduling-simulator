import { defineStore } from "pinia";
import type { SchedulingStrategy } from "@/models/SchedulingStrategy";
import Process from "@/models/Process";
import FiFoStrategy from "@/models/strategies/FiFoStrategy";

export const useScheduler = defineStore({
  id: "scheduler",
  state: () => {
    return {
      strategy: new FiFoStrategy([
        new Process("A", 3, 0),
        new Process("B", 3, 1),
        new Process("C", 2, 2),
        new Process("D", 4, 4),
      ]),
      processes: [
        new Process("A", 3, 0, 1),
        new Process("B", 3, 1, 1),
        new Process("C", 2, 2, 1),
        new Process("D", 4, 4, 1),
      ],
    };
  },
  actions: {
    setStrategy(strategy: SchedulingStrategy) {
      this.strategy = strategy;
    },
  },
  getters: {
    execute: (state) =>
      state.strategy.execute().map((stat) => ({
        name: stat.process.name,
        arrivalTime: stat.process.arrivalTime,
        cpuTime: stat.process.cpuTime,
        priority: stat.process.priority,
        startTime: stat.startTime,
        endTime: stat.endTime,
        waitTime: stat.waitTime,
      })),
  },
});
