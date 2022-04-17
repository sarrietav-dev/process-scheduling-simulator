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
        <Column header="Process Name" field="name" style="width: 20%">
          <template #editor="{ field, data }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>

        <Column header="Arrival Time" field="arrivalTime" style="width: 20%">
          <template #editor="{ field, data }">
            <InputNumber v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column header="CPU time" field="cpuTime" style="width: 20%">
          <template #editor="{ field, data }">
            <InputNumber v-model="data[field]" autofocus />
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

const scheduler = useScheduler();

const editingRows = ref([]);

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

let strategies = ref(getStrategies(scheduler));
</script>
