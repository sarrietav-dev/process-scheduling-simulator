<template>
  <input
    class="h-full rounded border-none transition-all focus:ring-2"
    placeholder="Type a name"
    v-model="value"
    type="text"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
