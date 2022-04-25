<template>
  <div class="p-fluid">
    <div class="card" style="height: 50%">
      <DataTable
        :value="scheduler.processes"
        edit-mode="row"
        data-key="name"
        v-model:editing-rows="editingRows"
        scrollable
        scroll-height="350px"
        responsive-layout="scroll"
        @row-edit-save="handleRowEdit"
      >
        <template #header>
          <div
            class="flex flex-col justify-between gap-5 sm:flex-row sm:gap-0 sm:py-5"
          >
            <div class="flex flex-col gap-5 sm:flex-row">
              <Dropdown
                v-model="selectedStrategy"
                :options="strategies"
                optionLabel="name"
                optionValue="name"
                placeholder="Estrategia de Planeacion"
              />
              <div
                v-if="selectedStrategy === 'Priority'"
                class="flex items-center space-x-5 sm:gap-5 sm:space-x-0"
              >
                <InputSwitch v-model="isPreemptive" class="inline" />
                <span class="text-lg">
                  {{ isPreemptive ? "Expropiativa" : "No Expropiativa" }}
                </span>
              </div>
              <slot name="run-button"></slot>
            </div>
            <Button
              id="add-process-button"
              class="p-button-info w-1/4 grow sm:grow-0"
              @click="addProcess"
              >Agregar Proceso</Button
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
            <component
              :is="getComponent(column.field)"
              v-model="data[field]"
              autofocus
            />
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

import DataTable, { type DataTableRowEditSaveEvent } from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import InputSwitch from "primevue/inputswitch";
import PriorityStrategy from "@/models/strategies/PriorityStrategy";
import FiFoStrategy from "@/models/strategies/FiFoStrategy";
import SJFStrategy from "@/models/strategies/SJFStrategy";
import PreemptivePriorityStrategy from "@/models/strategies/PreemptivePriorityStrategy";
import SRTFStrategy from "@/models/strategies/SRTFStrategy";
import type { SchedulingStrategy } from "@/models/SchedulingStrategy";

const scheduler = useScheduler();

const editingRows = ref([]);

const columns = ref([
  {
    header: "Nombre",
    field: "name",
  },
  {
    header: "Tiempo Llegada",
    field: "arrivalTime",
  },
  {
    header: "Tiempo de CPU",
    field: "cpuTime",
  },
]);

function getComponent(columnName: string) {
  switch (columnName) {
    case "name":
      return InputText;
    case "arrivalTime":
    case "cpuTime":
    case "priority":
      return InputNumber;
  }
}

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

const isPreemptive = ref(false);

const selectedStrategy = ref("");
const strategies = ref([
  { name: "FiFo" },
  { name: "SJF" },
  { name: "SRTF" },
  { name: "Prioridad" },
]);

watch(isPreemptive, (newValue) => {
  scheduler.$patch((state) => {
    state.strategy = newValue
      ? new PreemptivePriorityStrategy(state.processes)
      : new PriorityStrategy(state.processes);
  });
});

watch(selectedStrategy, (newValue) => {
  switch (newValue) {
    case "Priority":
      columns.value.push({
        header: "Priority",
        field: "priority",
      });

      scheduler.$patch((state) => {
        state.strategy = isPreemptive.value
          ? new PreemptivePriorityStrategy(state.processes)
          : new PriorityStrategy(state.processes);
      });
      break;
    case "FiFo":
      setNonPrioritableStrategy(new FiFoStrategy());
      break;
    case "SJF":
      setNonPrioritableStrategy(new SJFStrategy());
      break;
    case "SRTF":
      setNonPrioritableStrategy(new SRTFStrategy());
      break;
  }

  function setNonPrioritableStrategy(strategy: SchedulingStrategy) {
    columns.value = columns.value.filter(
      (column) => column.field !== "priority"
    );
    scheduler.$patch((state) => {
      strategy.setProcesses(state.processes);
      state.strategy = strategy;
    });
  }
});
</script>

<style>
@media (min-width: 640px) {
  #add-process-button {
    width: 25%;
  }

  /* .p-datatable-header {
    padding: 10px !important;
  } */
}
</style>
