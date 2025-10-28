<template>
	<div class="m-3 p-3">
		<BaseHeading>Add Budget</BaseHeading>
		<form @submit.prevent="addBudget()">
			<BaseInput
				id="budget-title"
				label="Title:"
				v-model="payload.title"
				type="text"
				:error="errorData.title"
				:required-data="true"
			/>

			<BaseInput
				id="budget-total"
				label="Amount:"
				v-model="payload.totalAmount"
				type="number"
				:error="errorData.totalAmount"
				:required-data="true"
			/>

			<BaseInput
				id="budget-currency"
				label="Currency:"
				v-model="payload.currency"
				type="text"
				:error="errorData.currency"
				:required-data="true"
			/>
			<BaseButton
				variant="success"
				size="lg"
				:is-full="true"
				type="submit"
				>Submit</BaseButton
			>
		</form>
	</div>
</template>

<script setup lang="ts">
	import { useBudgetStore } from "~/store/useBudgetStrore";

	interface BudgetPayload {
		title: string;
		totalAmount: number;
		currency: string;
	}

	const budget = useBudgetStore();

	const errorData = reactive({
		title: "",
		totalAmount: "",
		currency: "",
	});

	const payload = reactive<BudgetPayload>({
		title: "",
		totalAmount: 0,
		currency: "NRP",
	});
	const toast = useToast();

	async function addBudget() {
		errorData.title = "";
		errorData.totalAmount = "";
		errorData.currency = "";
		if (!payload.title.trim()) {
			errorData.title = "Title is required";
			return;
		}
		if (!payload.totalAmount) {
			errorData.totalAmount = "Amount is required";
			return;
		}
		if (!payload.currency.trim()) {
			errorData.currency = "currency is required";
			return;
		}
		if (payload.totalAmount < 10) {
			errorData.totalAmount = "Amount should be greater than 10";
			return;
		}
		const isCreated = await budget.createBudgets(payload);

		if (isCreated) {
			toast.success({ message: "Budget Created Successfully" });
		} else {
			toast.error({ message: "Budget Was Not Created " });
		}
	}
</script>
