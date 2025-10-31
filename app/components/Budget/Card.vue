<template>
	<div
		class="bg-slate-800 shadow-md rounded-2xl p-4 border border-slate-700 hover:shadow-lg transition m-5"
	>
		<div class="flex justify-between items-start mb-2">
			<h1 class="text-xl font-semibold text-gray-100">
				{{ budget.title }}
			</h1>

			<span>
				<div class="text-sm text-right text-gray-400">
					{{ formattedDate }}
				</div>

				<div class="text-right">
					<p class="text-sm text-gray-400">Total Amount</p>
					<p class="text-green-400 font-bold text-xl">
						NRS.
						{{ Number(budget.totalAmount).toFixed(2) }}
					</p>
				</div>
				<div class="text-right">
					<p class="text-sm text-gray-400">Remaining Amount</p>
					<p class="text-green-400 font-bold text-xl">
						NRS.
						{{ Number(budget.remainingAmount).toFixed(2) }}
					</p>
				</div>
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	interface Budget {
		createdAt: string;
		currency: string;
		id: string;
		title: string;
		totalAmount: string;
		userId: string;
		remainingAmount: string;
	}

	const props = defineProps<{ budget: Budget }>();

	const showMore = ref(false);

	const formattedDate = new Date(props.budget.createdAt).toLocaleDateString(
		"en-US",
		{
			year: "numeric",
			month: "short",
			day: "numeric",
		}
	);
</script>
