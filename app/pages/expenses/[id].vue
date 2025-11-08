<template>
	<div
		class="max-w-xl mx-auto mt-10 p-6 bg-slate-800 shadow-md rounded-2xl border border-gray-100"
	>
		<div v-if="loading" class="text-blue-500 text-center">
			Loading expense...
		</div>

		<div v-else-if="error" class="text-red-500 text-center">
			{{ error }}
		</div>

		<div v-else-if="expense" class="space-y-4">
			<h1 class="text-2xl font-semibold text-white">
				{{ expense.title }}
			</h1>

			<p class="text-gray-200">{{ expense.description }}</p>

			<div
				class="flex justify-between items-center text-sm text-white border-t pt-4"
			>
				<span>Date: {{ formattedDate }}</span>
				<span
					>Amount:
					<span class="font-medium text-gray-300">
						Rs. {{ expense.amount }}
					</span>
				</span>
			</div>

			<div class="flex justify-between text-sm text-white">
				<span>
					Split Type:
					<span class="font-medium">{{ expense.splitType }}</span>
				</span>
				<span>
					Budget Name:
					<span class="font-medium text-gray-300">{{
						budgetName || "Loading..."
					}}</span>
				</span>
			</div>

			<div
				v-if="participants.length"
				class="pt-4 border-t border-gray-700"
			>
				<BaseHeading variant="h3"> Participants </BaseHeading>
				<ul class="space-y-1 text-gray-300">
					<li
						v-for="p in participants"
						:key="p.userId"
						class="flex justify-between"
					>
						<span>{{ p.users.name }}</span>
						<span>Rs. {{ p.expense_participants.amountOwed }}</span>
						<span>
							Amount paid:
							{{ p.expense_participants.amountPaid }}</span
						>
					</li>
				</ul>
			</div>
			<div v-if="fileName">
				<img :src="`/api/files${fileName}`" alt="Image" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, computed } from "vue";
	import { useRoute } from "vue-router";
	import { useExpenseStore } from "~/store/useExpenseStore";

	const route = useRoute();
	const store = useExpenseStore();

	const expense = ref<any>(null);
	const loading = ref(true);
	const error = ref<string | null>(null);
	const budgetName = ref<string | null>(null);
	const participants = ref<any[]>([]);
	const fileName = ref();
	const token = useCookie("token");

	onMounted(async () => {
		try {
			expense.value = await store.getExpenseById(
				route.params.id as string
			);

			const { data: budgetData } = await useFetch(
				`/api/budget/${expense.value.budgetId}`,
				{
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				}
			);

			if (budgetData.value?.data) {
				budgetName.value =
					budgetData.value.data.title ?? "Unnamed Budget";
			}

			const { data: participantsData } = await useFetch(
				`/api/expenses/${expense.value.id}`,
				{
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				}
			);

			if (participantsData.value?.participants) {
				participants.value = participantsData.value.participants;
			}

			const receipt = await $fetch("/api/receipts", {
				query: {
					expenseId: expense.value.id,
				},
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
			});
			fileName.value = receipt?.fileUrl;
		} catch (err: any) {
			console.error("Error loading expense page:", err);
			error.value =
				err?.statusCode === 404
					? "Expense not found (404)"
					: "An error occurred while fetching expense.";
		} finally {
			loading.value = false;
		}
	});

	const formattedDate = computed(() =>
		expense.value ? new Date(expense.value.date).toLocaleDateString() : ""
	);
</script>
