<template>
	<BaseHeading>Expense</BaseHeading>
	<hr />
	<BaseHeading variant="h2">Expenses by Users</BaseHeading>
	<div v-for="user in expByUser" class="w-screen">
		<ExpenseCard :expense="user" />
	</div>
</template>

<script setup lang="ts">
	import { useExpenseStore } from "~/store/useExpenseStore";

	const expense = useExpenseStore();
	expense.getExpenses();

	const expByUser = expense.expenseByUser;
	const expForUser = expense.expenseForUser;
</script>
