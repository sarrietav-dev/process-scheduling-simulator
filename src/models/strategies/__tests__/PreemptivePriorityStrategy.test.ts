import Process from "../../Process";
import type { ProcessStatistic } from "../../SchedulingStrategy";
import PreemptivePriorityStrategy from "../PreemptivePriorityStrategy";
import { describe, test, expect } from "vitest";

describe("The algorithm works correctly", () => {
  const results: ProcessStatistic[] = [
    {
      process: new Process("P1", 4, 0, 3),
      startTime: [0, 11],
      endTime: [2, 13],
      waitTime: 9,
    },
    {
      process: new Process("P2", 3, 2, 1),
      startTime: [2],
      endTime: [5],
      waitTime: 0,
    },
    {
      process: new Process("P3", 2, 4, 2),
      startTime: [5, 10],
      endTime: [6, 11],
      waitTime: 5,
    },
    {
      process: new Process("P4", 4, 6, 1),
      startTime: [6],
      endTime: [10],
      waitTime: 0,
    },
  ];

  test("when ordered", () => {
    const processes: Process[] = [
      new Process("P1", 4, 0, 3),
      new Process("P2", 3, 2, 1),
      new Process("P3", 2, 4, 2),
      new Process("P4", 4, 6, 1),
    ];

    const strategy = new PreemptivePriorityStrategy(processes);

    expect(strategy.execute()).toEqual(results);
  });

  test("when unordered", () => {
    const processes: Process[] = [
      new Process("P3", 2, 4, 2),
      new Process("P1", 4, 0, 3),
      new Process("P4", 4, 6, 1),
      new Process("P2", 3, 2, 1),
    ];

    const strategy = new PreemptivePriorityStrategy(processes);

    expect(strategy.execute()).toEqual(results);
  });
});

test("the average computes correctly", () => {
  const processes: Process[] = [
    new Process("P3", 2, 4, 2),
    new Process("P1", 4, 0, 3),
    new Process("P4", 4, 6, 1),
    new Process("P2", 3, 2, 1),
  ];

  const strategy = new PreemptivePriorityStrategy(processes);

  expect(strategy.waitTimeAverage).toBe(3.5);
});

test("throws an error when not defining a priority in a process", () => {
  const processes: Process[] = [
    new Process("A", 3, 0),
    new Process("B", 3, 1),
    new Process("C", 2, 2),
    new Process("D", 4, 4),
  ];

  expect(() => new PreemptivePriorityStrategy(processes)).toThrow(
    "Every process must have a priority defined"
  );
});
