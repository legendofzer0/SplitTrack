<template>
	<BaseHeading>Expense</BaseHeading>
	<hr />
	<br />
	<BaseButton variant="success" @click="isOpen = true"
		>Add Expense</BaseButton
	>
	<br />
	<div class="flex text-center justify-center">
		<BaseChip
			:is-active="activeChip.expenseByUser"
			@click="changeChip('expenseByUser')"
			>Expenses by Users</BaseChip
		>
		<BaseChip
			:is-active="activeChip.expenseForUser"
			variant="secondary"
			@click="changeChip('expenseForUser')"
			>Expenses for Users</BaseChip
		>
	</div>
	<br />
	<BaseHeading variant="h2">{{ heading }}</BaseHeading>

	<div v-if="heading == 'Expense By User'">
		<div v-for="exp in expense.expenseByUser">
			<ExpenseByUserCard :expense="exp" />
		</div>
	</div>
	<div v-else>
		<div v-for="exp in expense.expenseForUser">
			<ExpenseForUserCard
				:expense="exp.expenses"
				:participant="exp.expense_participants"
			/>
		</div>
	</div>

	<BaseModal :is-open="isOpen">
		<template #header>
			<div class="flex items-center justify-between px-4 py-2 border-b">
				<h2 class="text-lg font-semibold text-white text-center flex-1">
					Add Expense
				</h2>
			</div>
		</template>

		<template #body>
			<ExpenseAdd @submitted:expense="submitted" />
		</template>
		<template #footer>
			<BaseButton variant="danger" @click="isOpen = false">
				Close
			</BaseButton>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
	import { useExpenseStore } from "~/store/useExpenseStore";
	const heading = ref("Expense By User");

	const isOpen = ref(false);
	const expense = useExpenseStore();
	expense.getExpenses();

	const activeChip = reactive({
		expenseByUser: true,
		expenseForUser: false,
	});
	async function submitted() {
		isOpen.value = false;
		await expense.getExpenses();
	}

	function changeChip(value: string) {
		for (const key in activeChip) {
			activeChip[key as keyof typeof activeChip] = key === value;
		}
		value === "expenseForUser"
			? (heading.value = "Expense For User")
			: (heading.value = "Expense By User");
	}
</script>
