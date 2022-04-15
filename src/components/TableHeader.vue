<template>
  <div class="grid grid-cols-3">
    <div
      v-for="header in headers"
      v-bind:key="header"
      class="text-center font-bold"
    >
      {{ header }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ withPriority: boolean }>();
const headers = ref(["Name", "Arrival Time", "CPU Time"]);
if (props.withPriority) headers.value.push("Priority");
</script>
