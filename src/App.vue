<script setup lang="ts">
import AddProcessButton from "@/components/AddProcessButton.vue";
import ProcessEntry from "@/components/ProcessEntry.vue";
import TableBody from "@/components/TableBody.vue";
import TableHeader from "@/components/TableHeader.vue";
import Process from "@/models/Process";
import "./index.css";
import { ref, watch } from "vue";
import { useScheduler } from "./stores/scheduler";
import FiFoStrategy from "./models/strategies/FiFoStrategy";
import SJFStrategy from "./models/strategies/SJFStrategy";
import PriorityStrategy from "./models/strategies/PriorityStrategy";

const scheduler = useScheduler();

function addProcess() {
  scheduler.$patch((state) => {
    state.processes.push(new Process("", 0, 0, 1));
    state.strategy.setProcesses(state.processes);
  });
}

let strategyChecked = ref();

let withPriority = ref(false);

watch(strategyChecked, (newValue) => {
  withPriority.value = newValue === "Priority";
});

let strategies = ref([
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
]);
</script>

<template>
  <main
    class="flex h-screen flex-col items-center justify-center bg-gradient-to-bl from-cyan-500 to-blue-500"
  >
    <div class="gap-2.5 rounded-2xl bg-white p-10 shadow">
      <TableHeader :with-priority="withPriority" />
      <TableBody>
        <ProcessEntry
          v-for="process in scheduler.processes"
          :with-priority="withPriority"
          v-bind:key="process.name"
          v-model:name="process.name"
          v-model:arrival-time.number="process.arrivalTime"
          v-model:cpu-time.number="process.cpuTime"
          v-model:priority.number="process.priority"
        />
      </TableBody>
      <AddProcessButton @click="addProcess" />
      <label v-for="strategy in strategies" v-bind:key="strategy.name">
        <input
          type="radio"
          name="strategy"
          v-model="strategyChecked"
          :value="strategy.name"
          @click="strategy.onClick"
          :checked="strategy.checked"
        />
        {{ strategy.name }}
      </label>
    </div>
  </main>
</template>
