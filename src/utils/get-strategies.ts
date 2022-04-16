import type Process from "@/models/Process";
import FiFoStrategy from "@/models/strategies/FiFoStrategy";
import PriorityStrategy from "@/models/strategies/PriorityStrategy";
import SJFStrategy from "@/models/strategies/SJFStrategy";
import type { Store } from "pinia";

export const getStrategies = (
  scheduler: Store<
    "scheduler",
    { strategy: FiFoStrategy; processes: Process[] }
  >
) => [
  {
    name: "FiFo",
    checked: true,
    onClick: () =>
      scheduler.$patch((state) => ({
        ...state,
        strategy: new FiFoStrategy(state.processes),
      })),
  },
  {
    name: "SJF",
    onClick: () =>
      scheduler.$patch((state) => ({
        ...state,
        strategy: new SJFStrategy(state.processes),
      })),
  },
  {
    name: "Priority",
    onClick: () =>
      scheduler.$patch((state) => ({
        ...state,
        strategy: new PriorityStrategy(state.processes),
      })),
  },
];
