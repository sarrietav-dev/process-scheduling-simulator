<template>
  <main
    class="flex h-screen flex-col justify-center bg-gradient-to-bl from-cyan-500 to-blue-500"
  >
    <ScheduleTable class="mx-5 sm:m-24" v-if="schedulePage" />
    <TheProcessInputTable v-else>
      <template #run-button>
        <Button class="p-button-success" @click="showSchedule"
          >Run scheduler</Button
        >
      </template>
    </TheProcessInputTable>
  </main>
</template>

<script setup lang="ts">
import "./index.css";
import TheProcessInputTable from "@/components/TheProcessInputTable/TheProcessInputTable.vue";
import { ref } from "vue";
import ScheduleTable from "@/components/TheScheduleTable.vue";
import Button from "primevue/button";

const schedulePage = ref(false);

const showSchedule = () => {
  schedulePage.value = true;
};
</script>
