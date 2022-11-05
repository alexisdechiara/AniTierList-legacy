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
										<el-button type="primary" class="grow" size="large" @click="[removeAllTiersEntries(),setEntries(entries, true)]">Auto rank anime</el-button>
										<el-button type="danger" class="grow" size="large" @click="removeTiersEntries()">Unrank all anime</el-button>
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
				</Popover>
				</div>
				<div v-if="filters.search != '' || filters.year != '' || filters.season != '' || filters.formats.length > 0 || filters.genres.length > 0" class="mb-8 flex flex-row items-center">
					<font-awesome-icon icon="fas fa-tags" class="h-[20px] w-[20px] text-[#afbfd1] mr-[16px]" />
				<div class="flex flex-row flex-wrap space-x-4">
					<el-tag v-if="filters.search != ''" type="primary" closable effect="dark" @close="filters.search =''">{{filters.search}}</el-tag>
					<el-tag v-if="filters.year != ''" type="primary" closable effect="dark" @close="filters.year =''">{{filters.year}}</el-tag>
					<el-tag v-if="filters.season != ''" type="primary" closable effect="dark" @close="filters.season =''">{{ filters.season }}</el-tag>
					<el-tag v-for="format, index in filters.formats" :key="format.value" type="primary" closable effect="dark" @close="removeFilteredFormat(index)">{{ format }}</el-tag>
					<el-tag v-for="genre, index in filters.genres" :key="genre.value" type="primary" closable effect="dark" @close="removeFilteredFormat(index)">{{ genre }}</el-tag>
				</div>
			</div>
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
import { ElButton, ElTag, ElSelect, ElOption, ElDialog, ElEmpty } from "element-plus";
import { Popover, PopoverButton, PopoverPanel, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

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
		ElTag,
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
							range: [8, 8.4],
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
			genres: [],
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
		this.changeTiersTemplate(this.templates[this.currentTemplate]);
		this.getAllEntries;
		for (let index = new Date().getFullYear(); index >= 1940; index--) {
			this.years.push({ label: index, value: index });
		}
		let genresTemplate = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller", "4-koma", "Achromatic", "Achronological Order", "Acting", "Adoption", "Advertisement", "Afterlife", "Age Gap", "Age Regression", "Agender", "Agriculture", "Airsoft", "Alchemy", "Aliens", "Alternate Universe", "American Football", "Amnesia", "Anachronism", "Angels", "Animals", "Anthology", "Anthropomorphism", "Anti-Hero", "Archery", "Artificial Intelligence", "Asexual", "Assassins", "Astronomy", "Athletics", "Augmented Reality", "Autobiographical", "Aviation", "Badminton", "Band", "Bar", "Baseball", "Basketball", "Battle Royale", "Biographical", "Bisexual", "Body Horror", "Body Swapping", "Boxing", "Boys' Love", "Bullying", "Butler", "Calligraphy", "Cannibalism", "Card Battle", "Cars", "Centaur", "CGI", "Cheerleading", "Chibi", "Chimera", "Chuunibyou", "Circus", "Classic Literature", "Clone", "College", "Coming of Age", "Conspiracy", "Cosmic Horror", "Cosplay", "Crime", "Crossdressing", "Crossover", "Cult", "Cultivation", "Cute Boys Doing Cute Things", "Cute Girls Doing Cute Things", "Cyberpunk", "Cyborg", "Cycling", "Dancing", "Death Game", "Delinquents", "Demons", "Denpa", "Detective", "Dinosaurs", "Disability", "Dissociative Identities", "Dragons", "Drawing", "Drugs", "Dullahan", "Dungeon", "Dystopian", "E-Sports", "Economics", "Educational", "Elf", "Ensemble Cast", "Environmental", "Episodic", "Ero Guro", "Espionage", "Fairy Tale", "Family Life", "Fashion", "Female Harem", "Female Protagonist", "Fencing", "Firefighters", "Fishing", "Fitness", "Flash", "Food", "Football", "Foreign", "Found Family", "Fugitive", "Full CGI", "Full Color", "Gambling", "Gangs", "Gender Bending", "Ghost", "Go", "Goblin", "Gods", "Golf", "Gore", "Guns", "Gyaru", "Handball", "Henshin", "Heterosexual", "Hikikomori", "Historical", "Homeless", "Ice Skating", "Idol", "Impersonation", "Isekai", "Iyashikei", "Josei", "Judo", "Kaiju", "Karuta", "Kemonomimi", "Kids", "Kuudere", "Lacrosse", "Language Barrier", "LGBTQ+ Themes", "Lost Civilization", "Love Triangle", "Mafia", "Magic", "Mahjong", "Maids", "Makeup", "Male Harem", "Male Protagonist", "Martial Arts", "Medicine", "Memory Manipulation", "Mermaid", "Meta", "Military", "Mixed Gender Harem", "Monster Boy", "Monster Girl", "Mopeds", "Motorcycles", "Musical", "Mythology", "Necromancy", "Nekomimi", "Ninja", "No Dialogue", "Noir", "Non-fiction", "Nudity", "Nun", "Office Lady", "Oiran", "Ojou-sama", "Orphan", "Otaku Culture", "Outdoor", "Pandemic", "Parkour", "Parody", "Philosophy", "Photography", "Pirates", "Poker", "Police", "Politics", "Post-Apocalyptic", "POV", "Primarily Adult Cast", "Primarily Child Cast", "Primarily Female Cast", "Primarily Male Cast", "Primarily Teen Cast", "Puppetry", "Rakugo", "Real Robot", "Rehabilitation", "Reincarnation", "Religion", "Revenge", "Robots", "Rotoscoping", "Rugby", "Rural", "Samurai", "Satire", "School", "School Club", "Scuba Diving", "Seinen", "Shapeshifting", "Ships", "Shogi", "Shoujo", "Shounen", "Shrine Maiden", "Skateboarding", "Skeleton", "Slapstick", "Slavery", "Software Development", "Space", "Space Opera", "Spearplay", "Steampunk", "Stop Motion", "Succubus", "Suicide", "Sumo", "Super Power", "Super Robot", "Superhero", "Surfing", "Surreal Comedy", "Survival", "Swimming", "Swordplay", "Table Tennis", "Tanks", "Tanned Skin", "Teacher", "Teens' Love", "Tennis", "Terrorism", "Time Manipulation", "Time Skip", "Tokusatsu", "Tomboy", "Torture", "Tragedy", "Trains", "Transgender", "Travel", "Triads", "Tsundere", "Twins", "Urban", "Urban Fantasy", "Vampire", "Video Games", "Vikings", "Villainess", "Virtual World", "Volleyball", "VTuber", "War", "Werewolf", "Witch", "Work", "Wrestling", "Writing", "Wuxia", "Yakuza", "Yandere", "Youkai", "Yuri", "Zombie"]
		genresTemplate.forEach(element => {
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
		removeFilteredFormat(index) {
			this.filters.formats.splice(index, 1);
		},
		removeFilteredFormat(index) {
			this.filters.genres.splice(index, 1);
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
		setEntries(list, auto) {
			list.forEach(entry => {
				if (entry.score != 0 && auto) {
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
			this.setEntries(this.entries, route.query.auto != null ? true : false);
		},
	},
};
</script>