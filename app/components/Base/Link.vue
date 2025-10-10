<template>
	<NuxtLink
		:to="to"
		:class="[
			'block dark rounded-md font-medium transition-colors duration-200',
			sizeClasses[size],
			variantClasses[variant],
			isFull ? 'w-full text-center' : 'inline-block',
		]"
		active-class="active-class"
	>
		<slot />
	</NuxtLink>
</template>

<script setup lang="ts">
	type Variant = "default" | "nav" | "button" | "inline";
	type Size = "sm" | "md" | "lg";

	const props = withDefaults(
		defineProps<{
			to: string;
			variant?: Variant;
			size?: Size;
			isFull?: boolean;
		}>(),
		{
			variant: "nav",
			size: "md",
			isFull: false,
		}
	);

	const sizeClasses: Record<Size, string> = {
		sm: "px-2 py-1 text-sm",
		md: "px-3 py-2 text-base",
		lg: "px-5 py-3 text-lg",
	};

	const variantClasses: Record<Variant, string> = {
		default: "text-blue-600 hover:underline dark:text-blue-400",
		nav: "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
		button: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg",
		inline: "text-blue-500 underline m-0 p-0",
	};
</script>

<style scoped>
	.active-class {
		background-color: #6d6d6d;
	}
</style>
