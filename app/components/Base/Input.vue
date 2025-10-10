<template>
	<div class="w-full m-2">
		<label
			v-if="label"
			:for="id"
			class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
		>
			{{ label }}
			<span v-if="requiredData" class="text-sm font-bold text-red-600"
				>*</span
			>
		</label>

		<!-- ✅ Use inputType instead of type -->
		<input
			:id="id"
			:type="inputType"
			v-model="model"
			:placeholder="placeholder"
			:disabled="disabled"
			:class="[
				'block w-full rounded-lg border focus:outline-none transition duration-150 ease-in-out',
				sizeClasses[size],
				disabled
					? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60'
					: 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
			]"
		/>

		<!-- ✅ Password toggle checkbox -->
		<p
			v-if="props.type === 'password'"
			class="mt-2 flex items-center gap-2"
		>
			<input
				type="checkbox"
				id="showPassword"
				v-model="isShowPassword"
				@click="togglePassword"
				class="cursor-pointer"
			/>
			<label
				for="showPassword"
				class="text-sm text-gray-700 dark:text-gray-300"
			>
				Show Password
			</label>
		</p>

		<!-- ✅ Error message -->
		<p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
			{{ error }}
		</p>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch } from "vue";

	const isShowPassword = ref(false);

	type InputSize = "sm" | "md" | "lg";
	type InputType =
		| "text"
		| "email"
		| "password"
		| "number"
		| "date"
		| "search"
		| "tel";

	const props = withDefaults(
		defineProps<{
			id?: string;
			modelValue: string | number;
			label?: string;
			type?: InputType;
			placeholder?: string;
			error?: string;
			size?: InputSize;
			disabled?: boolean;
			requiredData?: boolean;
		}>(),
		{
			type: "text",
			size: "md",
			disabled: false,
			requiredData: false,
		}
	);

	const emit = defineEmits<{
		(e: "update:modelValue", value: string | number): void;
	}>();

	const model = computed({
		get: () => props.modelValue,
		set: (val) => emit("update:modelValue", val),
	});

	// ✅ Local reactive type
	const inputType = ref(props.type);

	// Update local type when parent prop changes
	watch(
		() => props.type,
		(newType) => {
			inputType.value = newType;
		}
	);

	// ✅ Toggle show/hide password
	function togglePassword() {
		if (props.type === "password") {
			inputType.value = !isShowPassword.value ? "text" : "password";
		}
	}

	const sizeClasses: Record<InputSize, string> = {
		sm: "px-2 py-1 text-sm",
		md: "px-3 py-2 text-base",
		lg: "px-4 py-3 text-lg",
	};
</script>
