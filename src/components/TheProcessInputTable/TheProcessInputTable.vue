<template>
  <div class="p-fluid">
    <div class="card" style="height: 50%">
      <DataTable
        :value="scheduler.processes"
        edit-mode="row"
        data-key="name"
        v-model:editing-rows="editingRows"
        scroll-height="flex"
        responsive-layout="scroll"
        @row-edit-save="handleRowEdit"
      >
        <template #header>
          <div class="flex justify-between">
            <div class="flex gap-5">
              <Dropdown
                v-model="selectedStrategy"
                :options="strategies"
                optionLabel="name"
                optionValue="name"
              />
              <Button class="p-button-success">Run scheduler</Button>
            </div>
            <Button class="p-button-info" style="width: 25%"
              >Add process</Button
            >
          </div>
        </template>
        <Column
          v-for="column in columns"
          :field="column.field"
          :header="column.header"
          :key="column.header"
          style="width: 20%"
        >
          <template #editor="{ field, data }">
            <component :is="column.component" v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column
          row-editor
          style="width: 10%; min-width: 8rem"
          bodyStyle="text-align:center"
        />
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import Process from "@/models/Process";
import { useScheduler } from "@/stores/scheduler";
import { getStrategies } from "@/utils/get-strategies";

import DataTable, { type DataTableRowEditSaveEvent } from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

const scheduler = useScheduler();

const editingRows = ref([]);

const columns = ref([
  {
    header: "Process Name",
    field: "name",
    component: InputText,
  },
  {
    header: "Arrival Time",
    field: "arrivalTime",
    component: InputNumber,
  },
  {
    header: "CPU Time",
    field: "cpuTime",
    component: InputNumber,
  },
]);

function handleRowEdit(event: DataTableRowEditSaveEvent) {
  const { newData, index } = event;

  scheduler.$patch((state) => {
    state.processes[index] = new Process(
      newData.name,
      newData.cpuTime,
      newData.arrivalTime,
      newData.priority
    );
  });
}

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
  // TODO: Patch setStrategy
});

const selectedStrategy = ref("");
const strategies = ref([
  { name: "FiFo" },
  { name: "SJF" },
  { name: "Priority" },
]);
</script>
