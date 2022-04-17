<template>
  <main
    class="flex h-screen flex-col justify-center bg-gradient-to-bl from-cyan-500 to-blue-500"
  >
    <ScheduleTable v-if="schedulePage" />
    <TheProcessInputTable v-else>
      <template #run-button>
        <div
          class="col-span-3 rounded-2xl border-2 border-green-600 bg-green-300 py-2.5 text-center"
          @click="showSchedule"
        >
          Run scheduler
        </div>
      </template>
    </TheProcessInputTable>
  </main>
</template>

<script setup lang="ts">
import "./index.css";
import TheProcessInputTable from "@/components/TheProcessInputTable/TheProcessInputTable.vue";
import { ref } from "vue";
import ScheduleTable from "@/components/TheScheduleTable.vue";

const schedulePage = ref(false);

const showSchedule = () => {
  schedulePage.value = true;
};
</script>
