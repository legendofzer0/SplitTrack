import tailwindcss from "@tailwindcss/vite";
import "dotenv/config";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	app: {
		head: {
			title: "Split Track",
			htmlAttrs: {
				lang: "en",
			},
		},
	},
	modules: [
		"@pinia/nuxt",
		"nuxt-toast",
		"nuxt-file-storage",
		"nuxt-highcharts",
	],
	css: ["~/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	fileStorage: {
		mount: process.env.MOUNT,
	},
});
