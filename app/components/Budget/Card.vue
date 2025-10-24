<template>
	<div
		class="bg-slate-100 dark:bg-slate-800 shadow-md rounded-2xl p-4 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition m-5"
	>
		<div class="flex justify-between items-start mb-2">
			<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
				{{ budget.title }}
			</h2>
			<span>
				<div
					class="text-sm text-right text-gray-500 dark:text-gray-400"
				>
					{{ formattedDate }}
				</div>

				<div class="text-right">
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Amount
					</p>
					<p
						class="text-green-600 dark:text-green-400 font-bold text-xl"
					>
						NRS.
						{{ Number(budget.totalAmount).toFixed(2) }}
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
