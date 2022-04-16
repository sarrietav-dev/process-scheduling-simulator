<template>
  <div class="flex justify-between">
    <label v-for="strategy in strategies" v-bind:key="strategy.name">
      <input
        type="radio"
        name="strategy"
        v-model="strategyCheckedModel"
        :value="strategy.name"
        :checked="strategy.checked"
        @click="strategy.onClick"
      />
      {{ strategy.name }}
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  strategyChecked: boolean;
  strategies: (
    | {
        name: string;
        checked: boolean;
        onClick: () => void;
      }
    | {
        name: string;
        onClick: () => void;
        checked?: undefined;
      }
  )[];
}>();

const emit = defineEmits(["update:strategyChecked"]);

const strategyCheckedModel = computed({
  get() {
    return props.strategyChecked;
  },
  set(value) {
    emit("update:strategyChecked", value);
  },
});
</script>
