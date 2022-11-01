<template>
  <AniLabel :text="label">
    <template #input>
      <el-input v-model="modelValue" @change="updateValue" @keyup.enter="updateValue" :disabled="disabled" :clearable="clearable">
        <template v-if="search" #prefix>
          <el-icon>
            <search />
          </el-icon>
        </template>
      </el-input>
    </template>
  </AniLabel>
</template>

<script>
import { ElInput, ElIcon } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

export default {
  name: "AniInput",
  components: {
    ElInput,
    ElIcon,
    Search
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