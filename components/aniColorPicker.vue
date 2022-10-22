<template>
	<Popover v-slot="{open}" class="relative">
		<PopoverButton class="flex items-center justify-center w-[38px] h-[38px] bg-aniBody focus:outline-0 rounded-[6px] focus:shadow-aniShadowButton" @click="showColorPicker = !open">
			<SwatchIcon class="w-[18px] h-[18px]" :style="'fill:'+color"></SwatchIcon>
		</PopoverButton>

		<PopoverPanel class="absolute left-[50px] top-0 z-20">
			<ColorPicker v-show="showColorPicker" theme="light" :color="color" :colors-default="colorsDefault" sucker-hide @changeColor="changeColor" />
		</PopoverPanel>
	</Popover>
</template>

<script>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'
import { SwatchIcon } from "@heroicons/vue/24/solid"


export default {
	components: {
		ColorPicker,
		SwatchIcon,
		Popover,
		PopoverButton,
		PopoverPanel
	},
	data() {
		return {
			color: this.modelValue,
			showColorPicker: false,
			colorsDefault: ['#57b1ef', '#c063ff', '#4cca51', '#ef881a', '#e13333', '#fc9dd6', "#677b94"]
		}
	},
	props: {
		modelValue: String
	},
	methods: {
		changeColor(color) {
			this.color = color.hex;
			this.$emit('update:modelValue', this.color)
		},
	},
}
</script>