<template>
	<div v-if="isLoaded" class="bg-aniBody h-full flex items-center justify-center py-16">
		<div class="flex flex-col flex-wrap w-5/6">
			<div class="flex flex-row items-end my-[40px] space-x-8">
				<AniInput label="Test" />
				<AniInput label="Test" />
				<AniInput />
				<AniInput />
				<Popover v-slot="{open}" class="relative">
					<PopoverButton :class="{'text-aniPrimary' : popoverIsOpen}" class="flex items-center justify-center focus:text-aniPrimary hover:text-aniPrimary w-[38px] h-[38px] bg-aniWhite focus:outline-0 rounded-[6px] shadow-aniShadow">
						<AdjustmentsHorizontalIcon class="w-[18px] h-[18px]" @click="isOpen = !open" />
					</PopoverButton>
					<PopoverPanel class="flex flex-col absolute right-0 z-10 p-[40px] bg-aniWhite mt-[10px] rounded-[10px]">
						<div class="flex flex-row items-end space-x-4 ">
							<AniSelect background="body" label="Airing Status" :values="airingStatus" v-model="status" />
							<AniInput background="body" label="Test" />
							<AniInput background="body" label="Test" />
							<AniInput background="body" />
							<AniInput background="body" />
						</div>
						<Disclosure v-slot="{ disclosureIsOpen }">
							<!-- Use the `open` state to conditionally change the direction of an icon. -->
							<DisclosureButton class="flex flex-row pt-[30px] items-center font-semibold">
								<ChevronRightIcon class="h-[16px] w-[16px] text-[12px] text-[#adc0d2] mr-[6px]" :class="[disclosureIsOpen && 'rotate-90 transform']" />
								<span class="font-[overpass] text-[16px] text-[#516170]">Tierlist settings</span>
							</DisclosureButton>
							<DisclosurePanel>
								<template v-for="tier in tiers" :key="tier.name">
									<div class="flex flex-row items-end space-x-4">
										<AniInput background="body" v-model="tier.name" />
										<AniColorPicker v-model="tier.color" />
										<AniInput background="body" label="Between" />
										<AniInput background="body" label="And" />
									</div>
								</template>
							</DisclosurePanel>
						</Disclosure>
					</PopoverPanel>
				</Popover>
			</div>
			<template v-for="tier in tiers" :key="tier.name">
				<tier :name="tier.name" :color="tier.color" :entries="tier.entries" group="tier" transition />
			</template>
			<tier :entries="entries" group="tier" transition />
		</div>
	</div>
</template>

<script>
import draggable from "vuedraggable";
import { Popover, PopoverButton, PopoverPanel, Disclosure, DisclosureButton, DisclosurePanel, } from '@headlessui/vue'
import { AdjustmentsHorizontalIcon, ChevronRightIcon } from "@heroicons/vue/24/solid"

export default {
	name: "tierList",
	components: {
		draggable,
		Popover,
		PopoverButton,
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		AdjustmentsHorizontalIcon,
		ChevronRightIcon,
		PopoverPanel
	},
	data() {
		return {
			tiers: [
				{
					name: 'S+',
					color: '#3db4f2',
					entries: []
				},
				{
					name: 'S',
					color: '#c063ff',
					entries: []
				},
			],
			entries: [],
			airingStatus: ['airing', 'finished', 'not yet aired', 'cancelled'],
			drag: false,
			isLoaded: false,
			popoverIsOpen: false,
			disclosureIsOpen: false,
		}
	},
	created() {
		this.getAllEntries;
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
									coverImage {
										medium
										large
									}
									relations {
										edges {
											relationType
										}
									}
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
			let result = response.data.MediaListCollection.lists[0].entries;
			this.entries = result.filter(entry => entry.score >= 9 && !entry.media.relations.edges.some(edge => edge.relationType == 'PREQUEL'));
			// this.tiers[0].entries = result.filter(entry => entry.score >= 9 && entry.media.relations.edges.some(edge => edge.relationType == 'PREQUEL'));
			this.isLoaded = true;
		},
	},
};
</script>