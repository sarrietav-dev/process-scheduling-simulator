import Process from "../../Process";
import FiFoStrategy from "../FiFoStrategy";
import { describe, test, expect, vi } from "vitest";

describe("The algorithm works correctly", () => {
  const solution = [
    {
      process: { name: "A", cpuTime: 3, arrivalTime: 0 },
      startTime: [0],
      endTime: [3],
      waitTime: 0,
    },
    {
      process: { name: "B", cpuTime: 3, arrivalTime: 1 },
      startTime: [3],
      endTime: [6],
      waitTime: 2,
    },
    {
      process: { name: "C", cpuTime: 2, arrivalTime: 2 },
      startTime: [6],
      endTime: [8],
      waitTime: 4,
    },
    {
      process: { name: "D", cpuTime: 4, arrivalTime: 4 },
      startTime: [8],
      endTime: [12],
      waitTime: 4,
    },
  ];

  test("when ordered", () => {
    const processes: Process[] = [
      new Process("A", 3, 0),
      new Process("B", 3, 1),
      new Process("C", 2, 2),
      new Process("D", 4, 4),
    ];

    const strategy = new FiFoStrategy(processes);

    expect(strategy.execute()).toEqual(solution);
  });

  test("when unordered", () => {
    const processes: Process[] = [
      new Process("C", 2, 2),
      new Process("B", 3, 1),
      new Process("D", 4, 4),
      new Process("A", 3, 0),
    ];

    const strategy = new FiFoStrategy(processes);

    expect(strategy.execute()).toEqual(solution);
  });
});

describe("When accessing waitTimeAverage property", () => {
  const processes: Process[] = [
    new Process("A", 3, 0),
    new Process("B", 3, 1),
    new Process("C", 2, 2),
    new Process("D", 4, 4),
  ];

  test("returns the correct value", () => {
    const strategy = new FiFoStrategy(processes);
    strategy.execute();
    expect(strategy.waitTimeAverage).toBe(2.5);
  });

  test("calls execute() when it wasn't called before", () => {
    const strategy = new FiFoStrategy(processes);
    const executeSpy = vi.spyOn(strategy, "execute");
    strategy.waitTimeAverage;
    expect(executeSpy).toBeCalled();
  });

  test("doesn't call execute() when it was called before", () => {
    const strategy = new FiFoStrategy(processes);
    strategy.execute();
    const executeSpy = vi.spyOn(strategy, "execute");
    strategy.waitTimeAverage;
    expect(executeSpy).not.toBeCalled();
  });
});
