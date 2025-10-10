<template>
	<div v-if="!isOpen">
		<img src="../assets/icons/bars.svg" class="h-6 w-6" />
	</div>
	<div v-else>
		<img src="../assets/icons/x.svg" class="h-6 w-6" />
	</div>
</template>

<script setup>
	defineProps({
		isOpen: Boolean,
	});
</script>
