<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
	>
		<div
			class="bg-gray-900 text-white rounded-lg shadow-lg w-full items-center justify-center max-w-lg p-4 relative"
		>
			<div
				class="flex justify-between items-center border-b border-gray-700 pb-2 mb-2"
			>
				<slot name="header"> </slot>
			</div>

			<div class="mb-4">
				<slot name="body"> </slot>
			</div>

			<div
				class="flex justify-end space-x-2 border-t border-gray-700 pt-2"
			>
				<slot name="footer"> </slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { defineProps, defineEmits } from "vue";

	const props = defineProps<{
		isOpen: boolean;
	}>();
</script>

<style>
	div[v-cloak] {
		display: none;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.2s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
