import { defineStore } from "pinia";

export const useStore = defineStore("model", {
	state: () => ({
		username: "",
		tiers: [],
		unRankedTier: [],
		entries: [],
		filters: {
			year: "",
			season: "",
			formats: [],
		},
		options: {
			auto: false,
			type: "PREQUEL",
			minScore: 0,
			maxScore: 10,
		},
		isLoaded: false,
	}),
	getters: {
		getUsername(state) {
			return state.username;
		},
		getTiers(state) {
			return state.tiers;
		},
		getUnRankedTier(state) {
			return state.unRankedTier;
		},
		getEntries(state) {
			return state.entries;
		},
		getYear(state) {
			return state.filters.year;
		},
		getSeason(state) {
			return state.filters.season;
		},
		getFormats(state) {
			return state.filters.formats;
		},
		getType(state) {
			return state.options.type;
		},
		getMinScore(state) {
			return state.options.minScore;
		},
		getMaxScore(state) {
			return state.options.maxScore;
		},
		getAutoRank(state) {
			return state.options.auto;
		},
	},
	actions: {
		removeTier(index) {
			this.unRankedTier.push(...this.tiers[index].entries);
			this.tiers.splice(index, 1);
		},
		removeTiersEntries() {
			this.tiers.forEach(tier => {
				this.unRankedTier.push(...tier.entries);
				tier.entries = [];
			});
		},
		removeFilteredFormat(index) {
			this.filters.formats.splice(index, 1);
		},
		sortEntries() {
			this.entries = this.entries.sort((a, b) => b.score - a.score);
		},
		filterEntriesByRelationType() {
			this.entries = this.entries.filter(entry => !entry.media.relations.edges.some(edge => edge.relationType == this.options.type));
		},
		filterEntriesByScore() {
			this.entries = this.entries.filter(entry => entry.score >= this.options.minScore && entry.score <= this.options.maxScore);
		},
		setTiersEntries() {
			this.sortEntries();
			this.filterEntriesByRelationType();
			this.filterEntriesByScore();
			this.entries.forEach(entry => {
				if (entry.score != 0 && this.options.auto) {
					this.tiers.forEach(tier => {
						if (entry.score >= tier.range[0] && entry.score <= tier.range[1]) {
							tier.entries.push(entry);
						}
					});
				} else {
					this.unRankedTier.push(entry);
				}
			});
		},
		async fetchEntries(username) {
			if (this.username === "") this.username = username;
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

			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					query: query,
					variables: {
						username: this.username,
					},
				}),
			};

			const response = await fetch("https://graphql.anilist.co", options).then(response => response.json());
			this.entries = response.data.MediaListCollection.lists[0].entries;
			this.setTiersEntries();
			this.isLoaded = true;
		},
	},
});
