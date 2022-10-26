import ElementPlus from "unplugin-element-plus/vite";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	app: {
		head: {
			charset: "utf-8",
			title: "AniTierList",
			meta: [{ name: "description", content: "Unofficial Anilist tierlist maker" }],
			link: [
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
				},
				{
					rel: "stylesheet",
					href: "https://overpass-30e2.kxcdn.com/overpass.css",
				},
			],
		},
	},
	modules: ["@nuxtjs/tailwindcss"],
	tailwindcss: {
		// add '~tailwind.config` alias
		exposeConfig: true,
		viewer: true,
	},
	vite: {
		plugins: [ElementPlus()],
	},
	// build
	build: {
		transpile: ["element-plus/es"],
	},
});
