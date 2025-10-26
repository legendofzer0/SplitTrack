<template>
	<div
		class="bg-slate-800 shadow-md rounded-2xl p-4 border border-slate-700 hover:shadow-lg transition m-5"
		@click="navToDetail()"
	>
		<div class="flex justify-between items-start mb-2">
			<h2 class="text-lg font-semibold text-gray-100">
				{{ expense.title }}
			</h2>
			<span class="text-sm text-gray-400">
				{{ formattedDate }}
			</span>
		</div>

		<p
			class="text-gray-300 mb-3 whitespace-pre-line"
			:class="{ 'line-clamp-2': !showMore }"
		>
			{{ expense.description }}
		</p>
		<BaseButton
			v-if="expense.description.length > 80"
			variant="primary"
			size="sm"
			@click="showMore = !showMore"
		>
			{{ showMore ? "Read less" : "Read more" }}
		</BaseButton>

		<div class="flex justify-between items-center mt-3">
			<div>
				<p class="text-sm text-gray-400">Split Type</p>
				<p class="text-gray-200 font-medium capitalize">
					{{ expense.splitType }}
				</p>
			</div>
			<div class="text-right">
				<p class="text-sm text-gray-400">Amount</p>
				<p class="text-green-400 font-bold text-xl">
					NRS.
					{{ Number(expense.amount).toFixed(2) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	interface Expense {
		id: string;
		budgetId: string;
		creatorId: string;
		amount: string;
		title: string;
		description: string;
		date: string;
		splitType: string;
		createdAt: string;
	}

	const props = defineProps<{ expense: Expense }>();

	const showMore = ref(false);

	const formattedDate = new Date(props.expense.date).toLocaleDateString(
		"en-US",
		{
			year: "numeric",
			month: "short",
			day: "numeric",
		}
	);
	function navToDetail() {
		navigateTo(`/expenses/${props.expense.id}`);
	}
</script>
