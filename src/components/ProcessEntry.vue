<template>
  <div
    class="grid grid-cols-3 gap-3 py-2.5"
    :class="{ 'grid-cols-4': $props.withPriority }"
  >
    <input
      class="h-full rounded border-none transition-all focus:ring-2"
      placeholder="Type a name"
      :value="name"
      @input="emitName"
      type="text"
    />
    <input
      class="h-full rounded border-none transition-all focus:ring-2"
      placeholder="Type the arrival Time"
      v-model.number="arrivalTimeValue"
      type="number"
    />
    <input
      class="h-full rounded border-none transition-all focus:ring-2"
      placeholder="Type the CPU Time"
      v-model.number="cpuTimeValue"
      type="number"
    />
    <template v-if="withPriority">
      <input
        class="h-full rounded border-none transition-all focus:ring-2"
        placeholder="Type the CPU Time"
        v-model.number="priorityValue"
        type="number"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  name: string;
  arrivalTime: number;
  cpuTime: number;
  withPriority: boolean;
  priority?: number;
}>();

const emit = defineEmits([
  "update:name",
  "update:arrivalTime",
  "update:cpuTime",
  "update:priority",
]);

const arrivalTimeValue = computed({
  get() {
    return props.arrivalTime;
  },
  set(value) {
    emit("update:arrivalTime", value);
  },
});

const cpuTimeValue = computed({
  get() {
    return props.cpuTime;
  },
  set(value) {
    emit("update:cpuTime", value);
  },
});

const priorityValue = computed({
  get() {
    return props.priority;
  },
  set(value) {
    emit("update:priority", value);
  },
});

function emitName(event: Event) {
  emit("update:name", (event.target as HTMLInputElement).value);
}
</script>
