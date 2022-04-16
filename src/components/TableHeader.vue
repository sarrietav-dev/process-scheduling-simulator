<template>
  <div class="grid grid-cols-3" :class="{ 'grid-cols-4': $props.withPriority }">
    <div
      v-for="header in headers"
      v-bind:key="header"
      class="text-center font-bold"
    >
      {{ header }}
    </div>
    <div v-if="withPriority" class="text-center font-bold">Priority</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{ withPriority: boolean }>();
const headers = ref(["Name", "Arrival Time", "CPU Time"]);
</script>
