<template>
	<div class="h-full flex items-center justify-center">
		<div class="flex flex-col mx-32 px-[30px] min-h-screen max-h-full">
			<div class="flex flex-row items-end my-[40px] space-x-6">
				<AniInput label="Search" disabled search clearable v-model.lazy="modelStore.filters.search" />
				<AniSelect label="Genres" disabled />
				<AniSelect label="Year" :options="years" v-model.lazy="modelStore.filters.year" />
				<AniSelect label="Season" :options="seasons" v-model.lazy="modelStore.filters.season" />
				<AniSelect label="Format" multiple :options="formats" v-model.lazy="modelStore.filters.formats" />
				<Popover v-if="modelStore.isLoaded" v-slot="{open}" class="relative grow">
					<PopoverButton :class="{ 'text-aniPrimary': open }" class="float-right flex items-center justify-center w-[38px] h-[38px] bg-aniWhite focus:outline-0 rounded-[6px] shadow-aniShadow grow shrink">
						<font-awesome-icon icon="fas fa-sliders-h" :class="[open ? 'text-aniPrimary' : 'text-[#afbfd1]']" class="stroke-2 focus:text-aniPrimary hover:text-aniPrimary" />
					</PopoverButton>
					<PopoverPanel class="flex flex-col absolute right-0 top-10 z-10 p-[40px] bg-aniWhite mt-[10px] rounded-[10px] shadow-aniShadow w-[800px]">
						<Disclosure :defaultOpen="true" v-slot="{ open }">
							<DisclosureButton class="flex flex-row pt-[15px] items-center font-semibold mb-[15px]">
								<font-awesome-icon icon="fa-chevron-right fa-w-10 fa-fw" class="text-[12px] text-[#adc0d2] -ml-[2px] mr-[6px] transition duration-150 ease-in transform" :class="[open ? 'rotate-90' : 'rotate-0']" />
								<span class="font-[overpass] text-[16px] text-[#516170]">Tierlist settings</span>
							</DisclosureButton>
							<DisclosurePanel>
								<div class="flex flex-row mb-[30px] items-end space-x-6">
									<el-select class="ani-select-template" v-model="currentTemplate" @change="changeTiersTemplate(templates[currentTemplate])" placeholder="Template">
										<el-option label="Logarithmic" :value="0" />
										<el-option label="Linear" :value="1" />
									</el-select>
									<div class="flex flex-row items-end grow">
										<el-button type="primary" class="grow" size="large" @click="autoRank">Auto rank anime</el-button>
										<el-button type="danger" class="grow" size="large" @click="modelStore.removeTiersEntries">Unrank all anime</el-button>
								
									</div>
								</div>
								<template v-for="(tier, index) in modelStore.tiers" :key="tier.name">
									<div class="flex flex-row items-center space-x-6 mb-[10px]">
										<el-button type="danger" class="aspect-1" size="large" @click="modelStore.removeTier(index)">
											<font-awesome-icon icon="fas fa-trash-alt" />
										</el-button>
										<AniInput class="shrink ani-input-tier" background="body" v-model="tier.name" />
										<AniColorPicker v-model="tier.color" />
										<AniMultiRangeSlider class="grow" v-model="tier.range" />
									</div>
								</template>
								<el-button type="primary" class="w-full mt-[15px]" size="large" text bg @click="addTier">
									<font-awesome-icon icon="fas fa-plus" />
								</el-button>
							</DisclosurePanel>
						</Disclosure>
					</PopoverPanel>
				</Popover>
			</div>
			<div v-if="modelStore.getYear != '' || modelStore.getSeason != '' || modelStore.getFormats.length > 0" class="mb-8 flex flex-row items-center">
				<div class="h-[20px] w-[20px] text-[#afbfd1] mr-[16px]">
					<svg data-v-cd1dc2b6="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tags" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="tags-icon svg-inline--fa fa-tags fa-w-20">
						<path data-v-cd1dc2b6="" fill="currentColor" d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z" class=""></path>
					</svg>
				</div>
				<div class="flex flex-row flex-wrap space-x-4">
					<el-tag v-if="modelStore.filters.year != ''" type="primary" closable effect="dark" @close="modelStore.filters.year =''">{{modelStore.filters.year}}</el-tag>
					<el-tag v-if="modelStore.filters.season != ''" type="primary" closable effect="dark" @close="modelStore.filters.season =''">{{ modelStore.filters.season }}</el-tag>
					<el-tag v-for="format, index in modelStore.filters.formats" :key="format.value" type="primary" closable effect="dark" @close="modelStore.removeFilteredFormat(index)">{{ format }}</el-tag>
				</div>
			</div>
			<div v-if="modelStore.isLoaded && modelStore.entries.length > 0" id="tierList">
				<div class="overflow-hidden rounded-[6px]">
					<Tier v-for="tier in modelStore.tiers" :key="tier.name" :name="tier.name" :color="tier.color" :entries="tier.entries" group="tier" transition :filters="modelStore.filters" />
				</div>
				<Tier class="mt-8" :entries="modelStore.unRankedTier" group="tier" transition :filters="modelStore.filters" />
			</div>
			<AniLoader v-else-if="!modelStore.isLoaded" />
			<el-empty v-else description="No anime found, please check the username" />
		</div>
		<SaveAsImage v-if="true" @click="downloadDialogVisible = true" />
		<el-dialog v-model="downloadDialogVisible" destroy-on-close title="Right click > Save image as" fullscreen>
			<div class="flex justify-center" id="downloadDialog"></div>
		</el-dialog>
		</div>
</template>

<script>
import draggable from "vuedraggable";
import { ElButton, ElTag, ElSelect, ElOption, ElDialog, ElEmpty } from "element-plus";
import { Popover, PopoverButton, PopoverPanel, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

import { useStore } from "~~/stores/store";
import { mapStores } from "pinia";

export default {
	name: "TierList",
	components: {
		draggable,
		Popover,
		PopoverButton,
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		PopoverPanel,
		ElSelect,
		ElOption,
		ElTag,
		ElButton,
		ElDialog,
		ElEmpty
	},
	data() {
		return {
			downloadDialogVisible: ref(false),
			templates: [
				{
					label: 'logarithmic',
					value: [
						{
							name: 'S+',
							color: '#E13333',
							range: [10, 10],
							entries: []
						},
						{
							name: 'S',
							color: '#e58e2b',
							range: [9.5, 9.9],
							entries: []
						},
						{
							name: 'A',
							color: '#f9c62d',
							range: [9, 9.4],
							entries: []
						},
						{
							name: 'B',
							color: '#6ac75a',
							range: [8.5, 8.9],
							entries: []
						},
						{
							name: 'C',
							color: '#67aeed',
							range: [8, 8.5],
							entries: []
						},
						{
							name: 'D',
							color: '#6188E2',
							range: [7, 7.9],
							entries: []
						},
						{
							name: 'E',
							color: '#673AB7',
							range: [5, 6.9],
							entries: []
						},
						{
							name: 'F',
							color: '#2B2D42',
							range: [0, 4.9],
							entries: []
						},
					]
				},
				{
					label: 'linear',
					value: [
						{
							name: 'S',
							color: '#E13333',
							range: [10, 10],
							entries: []
						},
						{
							name: 'A',
							color: '#e58e2b',
							range: [9, 9.9],
							entries: []
						},
						{
							name: 'B',
							color: '#f9c62d',
							range: [8, 8.9],
							entries: []
						},
						{
							name: 'C',
							color: '#6ac75a',
							range: [7, 7.9],
							entries: []
						},
						{
							name: 'D',
							color: '#67aeed',
							range: [6, 6.9],
							entries: []
						},
						{
							name: 'E',
							color: '#6188E2',
							range: [5, 5.9],
							entries: []
						},
						{
							name: 'F',
							color: '#673AB7',
							range: [0, 4.9],
							entries: []
						},
					]
				}
			],
			currentTemplate: 0,
			seasons: [
				{
					label: 'Winter',
					value: 'WINTER'
				},
				{
					label: 'Spring',
					value: 'SPRING'
				},
				{
					label: 'Summer',
					value: 'SUMMER'
				},
				{
					label: 'Fall',
					value: 'FALL'
				}
			],
			years: [],
			formats: [
				{
					label: 'TV Show',
					value: 'TV',
				},
				{
					label: 'Movie',
					value: 'MOVIE',
				},
				{
					label: 'TV Short',
					value: 'TV_SHORT',
				},
				{
					label: 'Special',
					value: 'SPECIAL',
				},
				{
					label: 'OVA',
					value: 'OVA',
				},
				{
					label: 'ONA',
					value: 'ONA',
				},
				{
					label: 'Music',
					value: 'MUSIC',
				},
			],
			drag: false,
		}
	},
	computed: {
		...mapStores(useStore)
	},
	mounted() {
		const route = useRoute();
		// if (route.query.seasons != null) this.modelStore.options.type = "";
		// if (route.query.min != null && route.query.min != 0 && route.query.min < 10) this.modelStore.options.minScore = route.query.min;
		// if (route.query.max != null && route.query.max != 10 && route.query.max > this.modelStore.options.minScore) this.modelStore.options.maxScore = route.query.max;
		// this.modelStore.options.auto = route.query.auto != null ? true : false;

		this.changeTiersTemplate(this.templates[this.currentTemplate]);
		for (let index = new Date().getFullYear(); index >= 1940; index--) {
			this.years.push({ label: index, value: index });
		}

		if (this.modelStore.entries.length == 0) {
			this.modelStore.fetchEntries(route.params.username);
		}
	},
	methods: {
		autoRank() {
			this.modelStore.options.auto = false;
			this.modelStore.setTiersEntries();
		},
		addTier() {
			if (this.modelStore.tiers.length >= this.templates[this.currentTemplate].value.length) {
				let newTier = {
					name: 'New tier',
					color: '#2B2D42',
					range: [0, 0],
					entries: []
				}
				this.modelStore.tiers.push(newTier);
			} else {
				this.modelStore.tiers.push(this.templates[this.currentTemplate].value[this.modelStore.tiers.length]);
			}
		},
		changeTiersTemplate(template) {
			if (this.modelStore.tiers.length > 0) {
				this.modelStore.tiers.forEach(tier => this.modelStore.unRankedTier.push(...tier.entries));
				this.modelStore.tiers = [];
			}
			this.modelStore.tiers = Array.from(template.value);
		}
	},
};
</script>