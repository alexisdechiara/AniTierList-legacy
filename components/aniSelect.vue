<template>
  <AniLabel :text="label">
    <template #input>
      <el-select v-model="value" @change="updateValue" :multiple="multiple" :disabled="disabled" :collapse-tags="multiple" class="min-w-[150px]" :clearable="!multiple" placeholder="Any">
        <el-option class="capitalize" v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <!-- <select @change="updateValue" :class="[background == 'body' ? 'bg-aniBody' : 'bg-[#FBFBFB]', customClass != '' ?? customClass]" class="leading-aniLeading px-[15px] focus:outline-0 rounded-[6px] h-[40px] font-['Roboto']"> -->
    </template>
    </AniLabel>
</template>

<script>
import { ElSelect, ElOption } from "element-plus";

export default {
  name: "AniSelect",
  components: {
    ElSelect,
    ElOption
  },
  data() {
    return {
      value: '',
    };
  },
  props: {
    label: String,
    white: Boolean,
    modelValue: String,
    options: Array,
    multiple: Boolean,
    disabled: Boolean
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', this.value);
    }
  },
};
</script>

<style>
.el-input__wrapper,
.el-input__wrapper:hover {
  --el-select-input-focus-border-color: none;
  color: #adc0d2;
  --el-input-bg-color: #fbfbfb;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 6px;
  height: 40px;
  box-shadow: rgba(103, 132, 187, 0.1) 0px 14px 30px 0px,
    rgba(103, 132, 187, 0.04) 0px 4px 4px 0px !important;
}

.body-background~.el-input__wrapper,
.body-background~.el-input__wrapper:hover {
  --el-input-bg-color: #edf1f5 !important;
}

.el-input__inner {
  line-height: 40px;
  font-weight: 600 !important;
}

.el-select-dropdown__item {
  --el-text-color-regular: #748899;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding-right: 12px;
  padding-left: 12px;
  transition: background .2s ease-in-out, color .2s ease-in-out;
  white-space: normal;
}

.el-select-dropdown__list {
  padding: 10px !important;
}

.el-select-dropdown {
  border-radius: 6px !important;
}

.el-popper__arrow {
  visibility: hidden;
}

.el-popper__arrow {
  transform: none;
}

.el-select-dropdown__item:hover {
  color: #3db4f2 !important;
}
</style>