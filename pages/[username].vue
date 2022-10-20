<template>
	<div v-if="isLoaded" class="bg-aniBody h-full flex items-center justify-center py-16">
		<div class="rounded-aniRounded overflow-hidden bg-aniWhite flex flex-col flex-wrap w-9/12 h-5/6">
			<template v-for="tier in tiers" :key="tier.name">
				<tier :name="tier.name" :color="'bg-' + tier.color + '-500'" :entries="tier.entries" group="tier" transition />
			</template>
			<tier :entries="entries" group="tier" transition />
		</div>
	</div>
</template>

<script>
import draggable from "vuedraggable";

export default {
	name: "tierList",
	components: {
		draggable
	},
	data() {
		return {
			tiers: [
				{
					name: 'S+',
					color: 'blue',
					entries: []
				},
				{
					name: 'S',
					color: 'red',
					entries: []
				},
			],
			entries: [],
			drag: false,
			isLoaded: false
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