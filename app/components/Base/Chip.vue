<template>
	<button
		:class="[
			'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition m-1',
			variantClasses[variant],
			isActive ? 'ring-2 ring-white/70' : 'opacity-70',
		]"
		@click="$emit('select')"
	>
		<slot></slot>
	</button>
</template>

<script setup lang="ts">
	type Variant = "primary" | "secondary" | "danger" | "success";

	const props = withDefaults(
		defineProps<{
			variant?: Variant;
			isActive?: boolean;
		}>(),
		{
			variant: "primary",
			isActive: false,
		}
	);

	const variantClasses: Record<Variant, string> = {
		primary: "bg-blue-600 text-white",
		secondary: "bg-gray-700 text-gray-100",
		danger: "bg-red-700 text-white",
		success: "bg-green-700 text-white",
	};
</script>
