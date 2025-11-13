<template>
	<img
		v-if="is_default"
		:src="avatar"
		alt="User avatar"
		class="w-12 h-12 rounded-full object-cover border"
	/>
	<img
		v-else
		:src="`/api/avatar/${avatar}`"
		alt="User avatar"
		class="w-12 h-12 rounded-full object-cover border"
	/>
</template>

<script setup lang="ts">
	const props = defineProps({
		avatar: String,
		is_default: Boolean,
	});
</script>
