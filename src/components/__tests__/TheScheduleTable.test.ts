import Process from "../../models/Process";
import type { ProcessStatistic } from "@/models/SchedulingStrategy";
import { render } from "@testing-library/vue";
import TheScheduleTable from "../TheScheduleTable.vue";
import { describe, test, expect } from "vitest";

describe("TheScheduleTable component", () => {
  const results: ProcessStatistic[] = [
    {
      process: new Process("P1", 5, 0, 1),
      startTime: [0],
      endTime: [5],
      waitTime: 0,
    },
    {
      process: new Process("P3", 8, 2, 1),
      startTime: [5],
      endTime: [13],
      waitTime: 3,
    },
    {
      process: new Process("P2", 3, 1, 2),
      startTime: [13],
      endTime: [16],
      waitTime: 12,
    },
    {
      process: new Process("P4", 6, 3, 3),
      startTime: [16],
      endTime: [22],
      waitTime: 13,
    },
  ];

  test("renders without braces", () => {
    const wrapper = render(TheScheduleTable, {
      props: { stats: results },
    });

    const elements = wrapper.queryAllByText(/\[.+\]/);

    expect(elements.length).toBeGreaterThan(0);
  });
});
