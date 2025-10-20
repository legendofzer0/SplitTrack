<template>
	<component :is="variant" :class="headingClass">
		<slot />
	</component>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	const props = defineProps({
		variant: {
			type: String,
			default: "h1",
			validator: (v: string) => ["h1", "h2", "h3"].includes(v),
		},
	});

	const headingClass = computed(() => {
		switch (props.variant) {
			case "h2":
				return "text-center md:text-left md:m-2 md:p-2 text-3xl font-semibold";
			case "h3":
				return "text-center md:text-left md:m-2 md:p-2 text-2xl font-medium";
			default:
				return "text-center md:text-left md:m-2 md:p-2 text-5xl font-bold";
		}
	});
</script>
