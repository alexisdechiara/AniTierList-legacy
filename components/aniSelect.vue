<template>
  <label>
    <span v-if="label != ''" class="block font-[overpass] text-aniGray text-capitalize font-semibold text-base leading-[17px] py-[10px]">{{label}}</span>
    <select @change="updateValue" :class="[background == 'body' ? 'bg-aniBody' : 'bg-[#FBFBFB]', customClass != '' ?? customClass]" class="leading-aniLeading px-[15px] focus:outline-0 shadow-aniShadow rounded-[6px] h-[40px]">
      <option class="capitalize" value="" selected>Any</option>
      <template v-for="(item, index) in values" :key="index">
        <option class="capitalize" :value="item"> {{item}}</option>
      </template>
    </select>
  </label>
</template>

<script>
export default {
  name: "AniSelect",
  created() { },
  data() {
    return {};
  },
  props: {
    label: String,
    customClass: String,
    background: String,
    modelValue: String,
    values: Array
  },
  methods: {
    updateValue(event) {
      setTimeout(() => this.$emit('update:modelValue', event.target.value), 0);
    }
  },
};
</script>