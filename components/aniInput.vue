<template>
  <AniLabel :text="label">
    <template #input>
      <el-input v-model="modelValue" @change="updateValue" @keyup.enter="updateValue" :disabled="disabled" :clearable="clearable">
        <template v-if="search" #prefix>
          <font-awesome-icon icon="fa-solid fa-search" />
        </template>
      </el-input>
    </template>
  </AniLabel>
</template>

<script>
import { ElInput } from 'element-plus'
export default {
  name: "AniInput",
  components: {
    ElInput
  },
  data() {
    return {};
  },
  props: {
    label: String,
    modelValue: String,
    disabled: Boolean,
    search: Boolean,
    clearable: Boolean
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', this.modelValue);
    }
  },
};
</script>