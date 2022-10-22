<template>
	<div class="flex flex-row min-h-[150px]">
		<div v-if="name != null" :style="'background-color:' + color" class="flex min-h-[150px] min-w-[150px] text-white justify-center items-center font-bold text-5xl"><span>{{name}}</span></div>
		<draggable class="flex flex-wrap flex-row w-full" :group="group" :list="entries" tag="transition-group" :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }" v-model="list" :v-bind="transition ?? dragOptions" @start="isDragging = true" @end="isDragging = false" itemKey="media.id">
			<template #item="{element}">
				<img class="flex aspect-[2/3] object-cover h-[150px]" :src="element.media.coverImage.medium" alt="">
			</template>
		</draggable>
	</div>
</template>

<script>
import draggable from "vuedraggable";

export default {
	name: "tier",
	components: {
		draggable
	},
	props: {
		name: String,
		color: String,
		entries: Array,
		group: String,
		transition: Boolean,
	},
	computed: {
		dragOptions() {
			return {
				animation: 100,
				group: "description",
				disabled: false,
				ghostClass: "ghost"
			};
		}
	}
}
</script>