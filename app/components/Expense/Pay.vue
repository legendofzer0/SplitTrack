<template>
	<form @submit.prevent="submitForm">
		<BaseInput v-model="title" label="Title" :disabled="true" />
		<BaseInput v-model="amount" label="Amount" :disabled="true" />

		<div class="mt-4">
			<label class="text-white">Budgets:</label><br />
			<select
				v-model="selectedBudget"
				class="bg-slate-800 text-white border rounded p-2 w-full"
			>
				<option value="" disabled>Select a budget</option>
				<option
					v-for="budget in budgetData"
					:key="budget.id"
					:value="budget"
				>
					{{ budget.title }}
				</option>
			</select>

			<span class="text-red-700" v-if="budgetError">
				{{ budgetError }}
			</span>
		</div>

		<BaseButton variant="success" :is-full="true" size="md" type="submit">
			Submit
		</BaseButton>
	</form>
</template>

<script setup lang="ts">
	const token = useCookie("token");

	const budgetError = ref("");
	const selectedBudget = ref<any>(null);

	const props = defineProps<{
		expenseId: string;
		title: string;
		amount: string;
	}>();

	const title = ref(props.title ?? "");
	const amount = ref(props.amount ?? "");

	const budgetData = ref<any[]>([]);

	onMounted(async () => {
		try {
			getBudgetData();
		} catch (err) {
			console.error("Failed to load budgets:", err);
		}
	});

	async function getBudgetData() {
		try {
			const budget = await $fetch(
				"/api/budget/get-with-remaining-amount",
				{
					query: { amount: amount.value },
					method: "GET",
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				}
			);
			if (budget?.data) budgetData.value = budget.data;
		} catch (error) {
			console.log(error);
		}
	}
	const emit = defineEmits(["paid-successfully"]);

	const submitForm = async () => {
		if (!selectedBudget.value) {
			budgetError.value = "Please select a budget.";
			return;
		}
		budgetError.value = "";
		try {
			const submit = await $fetch("/api/expenses/participant-pay", {
				method: "POST",
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
				body: {
					budget: selectedBudget.value,
					expenseId: props.expenseId,
					amount: props.amount,
				},
			});
			if (submit) {
				emit("paid-successfully");
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>
