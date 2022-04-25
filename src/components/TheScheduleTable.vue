<template>
  <div class="card">
    <DataTable :value="stats" responsive-layout="scroll" scrollable>
      <Column header="Nombre" field="name"></Column>
      <Column header="Tiempo de Llegada" field="arrivalTime"></Column>
      <Column header="Tiempo de CPU" field="cpuTime"></Column>
      <Column header="Prioridad" field="priority"></Column>
      <Column header="Tiempo de Inicio" field="startTime"></Column>
      <Column header="Tiempo de Fin" field="endTime"></Column>
      <Column header="Tiempo de Espera" field="waitTime"></Column>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import Column from "primevue/column";
import DataTable from "primevue/datatable";

defineProps(["stats"]);
</script>
