<template>
	<div class="h-full flex items-center justify-center">
		<div class="flex flex-col mx-32 px-[30px] min-h-screen max-h-full">
			<div class="flex flex-row items-end my-[40px] space-x-6">
				<AniInput label="Search" search clearable v-model.lazy="filters.search" />
				<AniSelect label="Genres" multiple :options="genres" v-model.lazy="filters.genres" />
				<AniSelect label="Year" :options="years" v-model.lazy="filters.year" />
				<AniSelect label="Season" :options="seasons" v-model.lazy="filters.season" />
				<AniSelect label="Format" multiple :options="formats" v-model.lazy="filters.formats" />
				<Popover v-if="isLoaded" v-slot="{open}" class="relative grow">
					<PopoverButton :class="{ 'text-aniPrimary': open }" class="float-right flex items-center justify-center w-[38px] h-[38px] bg-aniWhite focus:outline-0 rounded-[6px] shadow-aniShadow grow shrink">
						<font-awesome-icon icon="fas fa-sliders-h" :class="[open ? 'text-aniPrimary' : 'text-[#afbfd1]']" class="stroke-2 focus:text-aniPrimary hover:text-aniPrimary" />
					</PopoverButton>
					<transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
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
											<el-button type="primary" class="grow" size="large" @click="[removeAllTiersEntries(),autoRank = true,setEntries(entries)]">Auto rank anime</el-button>
											<el-button type="danger" class="grow" size="large" @click="[autoRank = false,removeTiersEntries()]">Unrank all anime</el-button>
										</div>
									</div>
									<template v-for="(tier, index) in tiers" :key="tier.name">
										<div class="flex flex-row items-center space-x-6 mb-[10px]">
											<el-button type="danger" class="aspect-1" size="large" @click="removeTier(index)">
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
					</transition>
				</Popover>
				</div>
			<AniTags v-model="filters" />
			<div v-if="isLoaded && entries.length > 0" id="tierList">
				<div class="overflow-hidden rounded-[6px]">
					<tier v-for="tier in tiers" :key="tier.name" v-model="tier.name" :name="tier.name" :color="tier.color" :entries="tier.entries" group="tier" transition :filters="filters" />
				</div>
				<tier class="mt-8" :entries="unRankedTier" group="tier" transition :filters="filters" />
			</div>
			<AniLoader v-else-if="!isLoaded" />
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
import { ElButton, ElSelect, ElOption, ElDialog, ElEmpty } from "element-plus";
import { Popover, PopoverButton, PopoverPanel, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import data from '../content/data.json'
import templatesJSON from '../content/templates.json'

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
		ElSelect,
		ElOption,
		ElButton,
		ElDialog,
		ElEmpty
	},
	data() {
		return {
			downloadDialogVisible: ref(false),
			tiers: [],
			unRankedTier: [],
			filters: {
				search: '',
				genres: [],
				year: '',
				season: '',
				formats: []
			},
			years: [],
			seasons: data.seasons,
			genres: [],
			formats: data.formats,
			templates: templatesJSON,
			currentTemplate: 0,
			entries: [],
			drag: false,
			isLoaded: false,
			autoRank: false,
		}
	},
	created() {
		this.changeTiersTemplate(this.templates[this.currentTemplate]);
		this.getAllEntries;
		for (let index = new Date().getFullYear(); index >= 1940; index--) {
			this.years.push({ label: index, value: index });
		}
		data.genres.forEach(element => {
			this.genres.push({ label: element, value: element })
		})
	},
	methods: {
		removeTier(index) {
			this.unRankedTier.push(...this.tiers[index].entries);
			this.tiers.splice(index, 1);
		},
		addTier() {
			if (this.tiers.length >= this.templates[this.currentTemplate].value.length) {
				let newTier = {
					name: 'New tier',
					color: '#2B2D42',
					range: [0, 0],
					entries: []
				}
				this.tiers.push(newTier);
			} else {
				this.tiers.push(this.templates[this.currentTemplate].value[this.tiers.length]);
			}
		},
		removeTiersEntries() {
			this.tiers.forEach(tier => {
				this.unRankedTier.push(...tier.entries);
				tier.entries = [];
			})
		},
		removeUnrankedTierEntries() {
			this.unRankedTier = [];
		},
		removeAllTiersEntries() {
			this.removeTiersEntries();
			this.removeUnrankedTierEntries();
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
		setEntries(list) {
			list.forEach(entry => {
				if (entry.score != 0 && this.autoRank) {
					this.tiers.forEach(tier => {
						if ((entry.score >= tier.range[0] && entry.score <= tier.range[1])) {
							tier.entries.push(entry);
						}
					})
				} else {
					this.unRankedTier.push(entry);
				}
			});
		},
		changeTiersTemplate(template) {
			if (this.tiers.length > 0) {
				this.removeTiersEntries();
				this.tiers = [];
			}
			this.tiers = Array.from(template.value);
			if (this.autoRank) {
				this.setEntries(this.entries)
			}
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
										romaji
										english
										userPreferred
									}
									format
									season
									seasonYear
									genres
									coverImage {
										medium
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
			let result = response.data.MediaListCollection.lists[0].entries;
			this.entries = result.sort((a, b) => b.score - a.score);
			let minScore = 0, maxScore = 10;
			if (route.query.seasons == null) this.entries = this.filterByRelationType(this.entries, 'PREQUEL');
			if (route.query.min != null && route.query.min != 0 && route.query.min < 10) minScore = route.query.min;
			if (route.query.max != null && route.query.max != 10 && route.query.max > minScore) maxScore = route.query.max;
			this.entries = this.filterByScore(this.entries, minScore, maxScore);
			this.autoRank = route.query.auto != null ? true : false
			this.setEntries(this.entries);
		},
	},
};
</script>