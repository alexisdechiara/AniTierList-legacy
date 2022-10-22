/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./plugins/**/*.{js,ts}", "./nuxt.config.{js,ts}"],
	theme: {
		fontFamily: {
			sans: ["Roboto", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "sans-serif"],
		},
		extend: {
			colors: {
				aniPrimary: "#3db4f2",
				aniBody: "#edf1f5",
				aniWhite: "#fafafa",
				aniGray: "#5c728a",
			},
			borderRadius: {
				aniRounded: "4px",
			},
			lineHeight: {
				aniLeading: "40px",
			},
			shadow: {
				aniShadowButton: "0 1px 10px 0 rgba(49,54,68,0.15)",
				aniShadow: "0px 14px 30px rgba(103, 132, 187, 0.1), 0px 4px 4px rgba(103, 132, 187, 0.04)",
			},
		},
	},
	safelist: [
		{
			pattern: /bg-(gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fucshia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
		},
	],
	plugins: [],
};
