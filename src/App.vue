<template>
  <main
    class="flex h-screen flex-col items-center justify-center bg-gradient-to-bl from-cyan-500 to-blue-500"
  >
    <div class="gap-2.5 rounded-2xl bg-white p-10 shadow">
      <TheTableHeader :with-priority="withPriority" />
      <TheTableBody>
        <ProcessEntry
          v-for="process in scheduler.processes"
          :with-priority="withPriority"
          v-bind:key="process.name"
          v-model:name="process.name"
          v-model:arrival-time.number="process.arrivalTime"
          v-model:cpu-time.number="process.cpuTime"
          v-model:priority.number="process.priority"
        />
      </TheTableBody>
      <TheAddProcessButton @click="addProcess" />
      <TheStrategyList
        :strategies="strategies"
        v-model:strategyChecked="strategyChecked"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import "./index.css";
import TheAddProcessButton from "@/components/TheAddProcessButton.vue";
import ProcessEntry from "@/components/ProcessEntry.vue";
import TheTableBody from "@/components/TheTableBody.vue";
import TheTableHeader from "@/components/TheTableHeader.vue";
import Process from "@/models/Process";
import { useScheduler } from "@/stores/scheduler";
import { getStrategies } from "@/utils/get-strategies";
import TheStrategyList from "@/components/TheStrategyList.vue";

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

let strategies = ref(getStrategies(scheduler));
</script>
