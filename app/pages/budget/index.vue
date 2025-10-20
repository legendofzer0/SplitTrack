<template>
	<BaseHeading>Budget Management</BaseHeading>
	<hr />
</template>

<script setup lang="ts">
	import { useBudgetStore } from "~/store/useBudgetStrore";

	const budget = useBudgetStore();
	await budget.getBudgets();
</script>
