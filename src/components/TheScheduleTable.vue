<template>
  <div class="card">
    <DataTable :value="scheduler.execute" responsive-layout="scroll" scrollable>
      <Column header="Name" field="name"></Column>
      <Column header="ArrivalTime" field="arrivalTime"></Column>
      <Column header="CPU Time" field="cpuTime"></Column>
      <Column header="Priority" field="priority"></Column>
      <Column header="Start time" field="startTime"></Column>
      <Column header="End time" field="endTime"></Column>
      <Column header="Wait time" field="waitTime"></Column>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import { useScheduler } from "@/stores/scheduler";
import Column from "primevue/column";
import DataTable from "primevue/datatable";

const scheduler = useScheduler();
</script>
