<template>
  <AniLabel :text="label">
    <template #input>
      <input :type="type" :disabled="disabled" :value="modelValue" @change="updateValue" :class="[background == 'body' ? 'bg-aniBody' : 'bg-[#FBFBFB] shadow-aniShadow', customClass != '' ?? customClass]" class="leading-aniLeading px-[15px] focus:outline-0 rounded-[6px] w-full min-w-[150px] font-['Roboto']" />
    </template>
  </AniLabel>
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
    disabled: Boolean,
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