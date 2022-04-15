<script setup lang="ts">
import AddProcessButton from "@/components/AddProcessButton.vue";
import ProcessEntry from "@/components/ProcessEntry.vue";
import TableBody from "@/components/TableBody.vue";
import TableHeader from "@/components/TableHeader.vue";
import Process from "@/models/Process";
import "./index.css";
import { ref } from "vue";
import { useScheduler } from "./stores/scheduler";
import FiFoStrategy from "./models/strategies/FiFoStrategy";
import SJFStrategy from "./models/strategies/SJFStrategy";
import PriorityStrategy from "./models/strategies/PriorityStrategy";

const scheduler = useScheduler();

let processes = ref([
  new Process("A", 3, 0),
  new Process("B", 3, 1),
  new Process("C", 2, 2),
  new Process("D", 4, 4),
]);

function addProcess() {
  processes.value.push(new Process("", 0, 0));
}

let strategies = ref([
  { name: "FiFo", onClick: () => scheduler.setStrategy(new FiFoStrategy()) },
  { name: "SJF", onClick: () => scheduler.setStrategy(new SJFStrategy()) },
  {
    name: "Priority",
    onClick: () => scheduler.setStrategy(new PriorityStrategy()),
  },
]);
</script>

<template>
  <main
    class="flex h-screen flex-col items-center justify-center bg-gradient-to-bl from-cyan-500 to-blue-500"
  >
    <div class="gap-2.5 rounded-2xl bg-white p-10 shadow">
      <TableHeader />
      <TableBody>
        <ProcessEntry
          v-for="process in processes"
          v-bind:key="process.name"
          v-model:name="process.name"
          v-model:arrival-time.number="process.arrivalTime"
          v-model:cpu-time.number="process.cpuTime"
        />
      </TableBody>
      <AddProcessButton @click="addProcess" />
      <button
        v-for="strategy in strategies"
        v-bind:key="strategy.name"
        @click="strategy.onClick"
        class=""
      >
        {{ strategy.name }}
      </button>
    </div>
  </main>
</template>
