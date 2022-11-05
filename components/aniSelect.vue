<template>
  <AniLabel :text="label">
    <template #input>
      <el-select v-model="value" fit-input-width @change="updateValue()" :suffix-icon="ArrowDownBold" :clear-icon="CloseBold" :multiple="multiple" :disabled="disabled" :collapse-tags="multiple" class="min-w-[150px] max-w-[170px]" clearable placeholder="Any">
        <el-option class="capitalize" v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </template>
  </AniLabel>
</template>

<script setup lang="ts">
import { ElSelect, ElOption, ElIcon } from "element-plus";
import { ArrowDownBold, CloseBold } from '@element-plus/icons-vue';
import { ref } from 'vue'

const props = defineProps({
  label: String,
  white: Boolean,
  modelValue: Array,
  options: Array,
  multiple: Boolean,
  disabled: Boolean
});

const value = ref('');

const emit = defineEmits(['update:modelValue'])

function updateValue() {
  emit('update:modelValue', this.value);
}
</script>