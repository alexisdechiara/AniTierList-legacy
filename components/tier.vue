<template>
	<div class="flex flex-row min-h-[150px]">
		<div v-if="name != null" :style="'background-color:' + color" class="flex min-h-[150px] min-w-[150px] text-white justify-center items-center font-bold text-5xl"><span>{{name}}</span></div>
		<draggable class="flex flex-wrap flex-row w-full" :group="group" :list="entries" tag="transition-group" :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }" v-model="list" :v-bind="transition ?? dragOptions" @start="isDragging = true" @end="isDragging = false" itemKey="media.id">
			<template #item="{element}">
				<img v-show="checkYear(element.media.seasonYear) && checkSeason(element.media.season) && checkFormat(element.media.format)" class="flex aspect-[2/3] object-cover h-[150px]" :src="element.media.coverImage.medium" alt="">
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
		filters: Object,
	},
	methods: {
		checkYear(year) {
			if (this.filters.year != '') {
				return year == this.filters.year;
			} else return true
		},
		checkSeason(season) {
			if (this.filters.season != '') {
				return season == this.filters.season;
			} else return true
		},
		checkFormat(format) {
			if (this.filters.formats.length > 0) {
				return this.filters.formats.some(FilteredFormat => FilteredFormat == format);
			} else return true
		}
	},
	computed: {
		dragOptions() {
			return {
				animation: 100,
				group: "description",
				disabled: false,
				ghostClass: "ghost"
			};
		},
	}
}
</script>