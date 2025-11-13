<template>
	<div class="w-full p-3 border rounded-xl bg-gray-700">
		Total Remaining Budget:
		<p>{{ remainingBudget }}</p>
	</div>
</template>
<script setup lang="ts">
	const token = useCookie("token");
	const remainingBudget = ref(0);
	try {
		const budget = await $fetch("/api/budget/total-budget", {
			headers: {
				Authorization: token.value ? `Bearer ${token.value}` : "",
			},
		});
		remainingBudget.value = budget.totalAmount;
	} catch (error) {
		console.log(error);
	}
</script>
