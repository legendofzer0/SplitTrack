import tailwindcss from "@tailwindcss/vite";

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
	modules: ["@pinia/nuxt", "nuxt-toast"],
	css: ["~/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss()],
	},
});
