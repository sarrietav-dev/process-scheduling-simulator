<script setup lang="ts">
import AddProcessButton from "@/components/AddProcessButton.vue";
import ProcessEntry from "@/components/ProcessEntry.vue";
import TableBody from "@/components/TableBody.vue";
import TableHeader from "@/components/TableHeader.vue";
import Process from "@/models/Process";
import "./index.css";
import { ref } from "vue";

let processes = ref([
  new Process("A", 3, 0),
  new Process("B", 3, 1),
  new Process("C", 2, 2),
  new Process("D", 4, 4),
]);

function addProcess() {
  processes.value.push(new Process("", 0, 0));
}
</script>

<template>
  <main
    class="h-screen flex flex-col justify-center items-center bg-gradient-to-bl from-cyan-500 to-blue-500"
  >
    <div class="gap-2.5 bg-white p-10 rounded-2xl shadow">
      <TableHeader />
      <TableBody>
        <ProcessEntry
          v-for="process in processes"
          v-bind:key="process.name"
          v-model:name="process.name"
          v-model:arrival-time.number="process.arrivalTime"
          v-model:cpu-time.number="process.cpuTime"
        />
      </TableBody>
      <AddProcessButton @click="addProcess" />
    </div>
  </main>
</template>
