<template>
  <label>
    <span v-if="label != ''" class="block font-[overpass] text-aniGray text-capitalize font-semibold text-base leading-[17px] py-[10px]">{{label}}</span>
    <input :type="type" :value="modelValue" @change="updateValue" :class="[background == 'body' ? 'bg-aniBody' : 'bg-[#FBFBFB]', customClass != '' ?? customClass]" class="leading-aniLeading px-[15px] focus:outline-0 shadow-aniShadow rounded-[6px]">
  </label>
</template>

<script>
export default {
  name: "AniInput",
  created() { },
  data() {
    return {};
  },
  props: {
    label: String,
    customClass: String,
    background: String,
    modelValue: String,
    type: {
      type: String,
      default: 'text'
    },
  },
  methods: {
    updateValue(event) {
      setTimeout(() => this.$emit('update:modelValue', event.target.value), 0);
    }
  },
};
</script>