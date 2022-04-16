<template>
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
    <slot name="run-button"></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import "./index.css";
import TheAddProcessButton from "@/components/TheProcessInputTable/components/TheAddProcessButton.vue";
import ProcessEntry from "@/components/TheProcessInputTable/components/ProcessEntry.vue";
import TheTableBody from "@/components/TheProcessInputTable/components/TheTableBody.vue";
import TheTableHeader from "@/components/TheProcessInputTable/components/TheTableHeader.vue";
import Process from "@/models/Process";
import { useScheduler } from "@/stores/scheduler";
import { getStrategies } from "@/utils/get-strategies";
import TheStrategyList from "@/components/TheProcessInputTable/components/TheStrategyList.vue";

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
