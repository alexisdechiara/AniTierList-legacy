import ElementPlus from "unplugin-element-plus/vite";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	app: {
		head: {
			charset: "utf-8",
			title: "AniTierList",
			meta: [{ name: "description", content: "Unofficial Anilist tierlist maker" }],
			script: [{ type: "text/javascript", src: "node_modules/default-passive-events/dist/index.js" }],
			link: [
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
				},
				{
					rel: "stylesheet",
					href: "https://overpass-30e2.kxcdn.com/overpass.css",
				},
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
				{ rel: "icon", type: "image/png", href: "/favicon.png" },
			],
		},
	},
	ssr: false,
	modules: ["@nuxtjs/tailwindcss", "@nuxt/content"],
	tailwindcss: {
		// add '~tailwind.config` alias
		exposeConfig: true,
		viewer: true,
	},
	css: ["@fortawesome/fontawesome-svg-core/styles.css", "@/assets/scss/main.scss", "@/assets/scss/input.scss", "@/assets/scss/button.scss", "@/assets/scss/dialog.scss"],
	vite: {
		plugins: [ElementPlus()],
	},
	// build
	build: {
		transpile: ["element-plus/es", "@fortawesome/fontawesome-svg-core", "@fortawesome/free-brands-svg-icons"],
	},
});
