<template>
	<BaseHeading>Budget Management</BaseHeading>
	<hr />
	<BaseButton
		v-if="!isOpen"
		variant="success"
		size="md"
		@click="isOpen = true"
		>Add Budget</BaseButton
	>
	<BaseButton v-if="isOpen" variant="danger" size="md" @click="isOpen = false"
		>Close</BaseButton
	>
	<div v-if="isOpen">
		<BudgetAdd />
		<hr />
	</div>

	<div v-for="b in budget.budgetData">
		<BudgetCard :budget="b" />
	</div>
</template>

<script setup lang="ts">
	import BudgetCard from "~/components/Budget/Card.vue";
	import { useBudgetStore } from "~/store/useBudgetStrore";
	const isOpen = ref(false);
	const budget = useBudgetStore();
	budget.getBudgets();
	console.log(budget.budgetData);
</script>
