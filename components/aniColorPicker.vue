<template>
	<Popover v-slot="{ open }" class="relative">
		<PopoverButton class="flex items-center justify-center w-[40px] aspect-1 bg-aniBody focus:outline-0 rounded-[6px] focus:shadow-aniShadowButton" @click="showColorPicker = !open">
			<font-awesome-icon class="w-[18px] h-[18px]" icon="fas fa-eye-dropper" :style="'fill:' + color" />
		</PopoverButton>

		<PopoverPanel class="absolute left-[50px] top-0 z-20">
			<ColorPicker class="box-content" v-show="showColorPicker" theme="light" :color="color" :colors-default="colorsDefault" sucker-hide @changeColor="changeColor" />
		</PopoverPanel>
	</Popover>
</template>

<script>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'


export default {
	components: {
		ColorPicker,
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