<template>
  <table class="rounded bg-white shadow">
    <thead class="table w-full table-fixed border-b">
      <tr class="block">
        <th
          class="px-6 py-4 text-left text-sm font-medium text-gray-900"
          v-for="header in headers"
          v-bind:key="header"
        >
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody class="block max-h-60 w-full overflow-auto">
      <tr
        class="table w-full table-fixed border-b"
        v-for="stat in scheduler.execute"
        v-bind:key="stat.process.name"
      >
        <CustomTd>{{ stat.process.name }}</CustomTd>
        <CustomTd>
          {{ stat.process.arrivalTime }}
        </CustomTd>
        <CustomTd>
          {{ stat.process.cpuTime }}
        </CustomTd>
        <CustomTd>
          {{ stat.startTime }}
        </CustomTd>
        <CustomTd>
          {{ stat.endTime }}
        </CustomTd>
        <CustomTd>
          {{ stat.waitTime }}
        </CustomTd>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { useScheduler } from "@/stores/scheduler";
import { ref } from "vue";
import NewComponent from "@/components/CustomTd.vue";
import CustomTd from "@/components/CustomTd.vue";

const scheduler = useScheduler();

const headers = ref([
  "Process Name",
  "Arrival Time",
  "CPU Time",
  "Start Time",
  "End Time",
  "Wait Time",
]);
</script>
