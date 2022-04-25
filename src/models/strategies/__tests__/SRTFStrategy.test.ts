import Process from "@/models/Process";
import type { ProcessStatistic } from "@/models/SchedulingStrategy";
import { describe, expect, test } from "vitest";
import SRTFStrategy from "../SRTFStrategy";

describe("The SRTF strategy", () => {
  const results: ProcessStatistic[] = [
    {
      process: new Process("A", 5, 0),
      startTime: [0, 7],
      endTime: [1, 11],
      waitTime: 6,
    },
    {
      process: new Process("B", 2, 1),
      startTime: [1],
      endTime: [3],
      waitTime: 0,
    },
    {
      process: new Process("C", 1, 3),
      startTime: [3],
      endTime: [4],
      waitTime: 0,
    },
    {
      process: new Process("D", 3, 4),
      startTime: [4],
      endTime: [7],
      waitTime: 0,
    },
  ];

  const processes = results.map((stat) => stat.process);

  test("works correctly when ordered", () => {
    const strategy = new SRTFStrategy(processes);

    expect(strategy.execute()).toStrictEqual(results);
  });

  test("works correctly when unordered", () => {
    const strategy = new SRTFStrategy([...processes].reverse());

    expect(strategy.execute()).toStrictEqual(results);
  });

  test("calculates the wait time mean correctly", () => {
    const strategy = new SRTFStrategy([...processes].reverse());

    expect(strategy.waitTimeAverage).toBe(1.5);
  });
});
