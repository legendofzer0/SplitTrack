<script setup lang="ts">
	type ButtonType = "button" | "submit" | "reset";
	type Variant = "primary" | "secondary" | "danger" | "success" | "plain";
	type Size = "sm" | "md" | "lg";

	const props = withDefaults(
		defineProps<{
			variant?: Variant;
			size?: Size;
			isFull?: boolean;
			type?: ButtonType;
		}>(),
		{
			variant: "primary",
			size: "md",
			isFull: false,
			type: "button",
		}
	);

	const sizeClasses: Record<Size, string> = {
		sm: "px-3 py-1 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg",
	};

	const variantClasses: Record<Variant, string> = {
		primary: " text-white bg-blue-500 hover:bg-blue-600",
		secondary: " text-gray-900 bg-gray-700 text-white hover:bg-gray-600",
		danger: "bg-red-600 text-white hover:bg-red-700",
		success: "  bg-green-700 text-white hover:bg-green-600",
		plain: "text-white",
	};
</script>

<template>
	<button
		:type="props.type"
		:class="[
			'rounded-lg font-medium focus:outline-none transition-colors duration-200 m-3',
			props.isFull ? 'w-full' : 'inline-block',
			sizeClasses[props.size],
			variantClasses[props.variant],
		]"
	>
		<slot />
	</button>
</template>
