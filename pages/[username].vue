<template>
	<div v-if="isLoaded" class="bg-aniBody h-full flex items-center justify-center py-16">
		<div class="flex flex-col mx-32 px-[30px]">
			<div class="flex flex-row items-end my-[40px] space-x-8">
				<AniInput label="Search" disabled />
				<AniSelect label="Genres" disabled />
				<AniSelect label="Year" :options="years" v-model="filters.year" />
				<AniSelect label="Season" :options="seasons" v-model="filters.season" />
				<AniSelect label="Format" multiple :options="formats" v-model="filters.formats" />

				<Popover v-slot="{open}" class="relative">
					<PopoverButton :class="{ 'text-aniPrimary': open }" class="flex items-center justify-center focus:text-aniPrimary hover:text-aniPrimary w-[38px] h-[38px] bg-aniWhite focus:outline-0 rounded-[6px] shadow-aniShadow grow shrink">
						<el-icon :size="24" color="#afbfd1">
							<Operation />
						</el-icon>
					</PopoverButton>
					<PopoverPanel class="flex flex-col absolute right-0 z-10 p-[40px] bg-aniWhite mt-[10px] rounded-[10px] shadow-aniShadow w-[800px]">
						<Disclosure v-slot="{ open }">
							<DisclosureButton class="flex flex-row pt-[30px] items-center font-semibold mb-[30px]">
								<el-icon>
									<ArrowRightBold class="text-[#adc0d2] mr-[6px] transition duration-150 ease-in transform" :class="[open ? 'rotate-90' : 'rotate-0']" />
								</el-icon>
								<span class="font-[overpass] text-[16px] text-[#516170]">Tierlist settings</span>
							</DisclosureButton>
							<DisclosurePanel>
								<template v-for="(tier, index) in tiers" :key="tier.name">
									<div class="flex flex-row items-center space-x-6 mb-[10px]">
										<el-button type="danger" class="aspect-1" @click="removeTier(index)">
											<el-icon>
												<DeleteFilled />
											</el-icon>
										</el-button>
										<AniInput class="shrink" background="body" v-model="tier.name" />
										<AniColorPicker v-model="tier.color" />
										<AniMultiRangeSlider class="grow" v-model="tier.range" />
									</div>
								</template>
								<el-button type="primary" class="w-full mt-[15px]" size="large" text bg @click="addTier">
									<el-icon :size="20">
										<Plus />
									</el-icon>
								</el-button>
							</DisclosurePanel>
						</Disclosure>
					</PopoverPanel>
				</Popover>
			</div>
			<div v-if="filters.year != '' || filters.season != '' || filters.formats.length > 0" class="mb-8 flex flex-row items-center">
				<div class="h-[20px] w-[20px] text-[#afbfd1] mr-[16px]">
					<svg data-v-cd1dc2b6="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tags" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="tags-icon svg-inline--fa fa-tags fa-w-20">
						<path data-v-cd1dc2b6="" fill="currentColor" d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z" class=""></path>
					</svg>
				</div>
				<div class="flex flex-row flex-wrap space-x-4">
					<el-tag v-if="filters.year != ''" type="primary" closable effect="dark" @close="filters.year =''">{{filters.year}}</el-tag>
					<el-tag v-if="filters.season != ''" type="primary" closable effect="dark" @close="filters.season =''">{{ filters.season }}</el-tag>
					<el-tag v-for="format, index in filters.formats" :key="format.value" type="primary" closable effect="dark" @close="removeFilteredFormat(index)">{{ format }}</el-tag>
				</div>
			</div>
			<div class="overflow-hidden rounded-[6px]">
				<template v-for="tier in tiers" :key="tier.name">
					<tier :name="tier.name" :color="tier.color" :entries="tier.entries" group="tier" transition :filters="filters" />
				</template>
			</div>
			<tier class="mt-8" :entries="entries" group="tier" transition :filters="filters" />
		</div>
	</div>
</template>

<script>
import draggable from "vuedraggable";
import { Popover, PopoverButton, PopoverPanel, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Operation, DeleteFilled, ArrowRightBold, Plus } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElTag } from "element-plus";

export default {
	name: "tierList",
	components: {
		draggable,
		Popover,
		PopoverButton,
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		PopoverPanel,
		DeleteFilled,
		ElIcon,
		ArrowRightBold,
		Plus,
		Operation,
		ElTag,
		ElButton
	},
	data() {
		return {
			tiers: [],
			filters: {
				year: '',
				season: '',
				formats: []
			},
			templates: {
				logarithmic: [
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
			entries: [],
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
			isLoaded: false,
		}
	},
	created() {
		Object.assign(this.tiers, this.templates.logarithmic);
		for (let index = new Date().getFullYear(); index >= 1940; index--) {
			this.years.push({ label: index, value: index });
		}
		this.getAllEntries;
	},
	methods: {
		removeTier(index) {
			this.entries.push(...this.tiers[index].entries);
			this.tiers.splice(index, 1);
		},
		addTier() {
			if (this.tiers.length >= this.templates.logarithmic.length) {
				let newTier = {
					name: 'New tier',
					color: '#2B2D42',
					range: [0, 0],
					entries: []
				}
				this.tiers.push(newTier);
			} else {
				this.tiers.push(this.templates.logarithmic[this.tiers.length]);
			}
		},
		removeFilteredFormat(index) {
			this.filters.formats.splice(index, 1);
		},
		filterByRelationType(list, type) {
			return list.filter(entry => !entry.media.relations.edges.some(edge => edge.relationType == type));
		},
		filterByScore(list, minScore, maxScore) {
			return list.filter(entry => entry.score >= minScore && entry.score <= maxScore);
		},
		filterByYear(list, year) {
			return list.filter(entry => entry.media.seasonYear === year);
		},
		filterBySeason(list, season) {
			return list.filter(entry => entry.media.season === season);
		},
		filterByFormats(list, formats) {
			return list.filter(entry => entry.media.formats.formats.some(entryFormat => formats.forEach(selectedFormat => entryFormat == selectedFormat)));
		},
		updateEntries() {
			console.log(this.filters.year);
			this.tiers.forEach(tier => {
				if (this.filters.year != '') {
					tier.entries = this.filterByYear(tier.entries, this.filters.year);
				}

				if (this.filters.season != '') {
					tier.entries = this.filterBySeason(tier.entries, this.filters.season);
				}

				if (this.filters.formats.length > 0) {
					tier.entries = this.filterByFormats(tier.entries, this.filters.year);
				}
			});

			if (this.filters.year != '') {
				this.entries = this.filterByYear(this.entries, this.filters.year);
			}

			if (this.filters.season != '') {
				this.entries = this.filterBySeason(this.entries, this.filters.season);
			}

			if (this.filters.formats.length > 0) {
				this.entries = this.filterByFormats(this.entries, this.filters.year);
			}
		},
		autoSetEntries(list) {
			list.forEach(entry => {
				if (entry.score != 0) {
					this.tiers.forEach(tier => {
						if ((entry.score >= tier.range[0] && entry.score <= tier.range[1])) {
							tier.entries.push(entry);
						}
					})
				} else {
					this.entries.push(entry);
				}
			});
		}
	},
	computed: {
		async getAllEntries() {
			var query = `
				query ($username: String) {
					MediaListCollection(userName: $username, type: ANIME) {
						lists {
							entries {
								score(format: POINT_10_DECIMAL)
								media {
									id
									title {
										userPreferred
									}
									format
									season
									seasonYear
									genres
									coverImage {
										medium
										large
									}
									relations {
										edges {
											relationType
										}
									}
									status
									siteUrl
								}
							}
						}
					}
				}
			`;

			const route = useRoute()

			// Define the config we'll need for our Api request
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					query: query,
					variables: {
						username: route.params.username,
					},
				}),
			};

			const response = await fetch("https://graphql.anilist.co", options).then(response => response.json());
			this.isLoaded = true;
			let result = response.data.MediaListCollection.lists[0].entries.sort((a, b) => b.score - a.score);
			let filtered = this.filterByRelationType(result, 'PREQUEL');
			filtered = this.filterByScore(filtered, 0, 10);
			this.autoSetEntries(filtered);
		},
	},
};
</script>