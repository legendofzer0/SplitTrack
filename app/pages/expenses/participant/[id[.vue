<template>
	<div
		v-if="data"
		class="max-w-2xl mx-auto bg-slate-800 text-white p-6 rounded-2xl shadow-md mt-6 border border-gray-700"
	>
		<div class="mb-6">
			<h2 class="text-2xl font-semibold">{{ expense?.title }}</h2>
			<p class="text-gray-300 text-sm mt-1">
				<b>Amount:</b> Rs. {{ expense?.amount }}
			</p>
			<p class="text-gray-300 text-sm">
				<b>Date:</b> {{ formatDate(expense?.date) }}
			</p>
			<p class="text-gray-300 text-sm">
				<b>Split Type:</b> {{ expense?.splitType }}
			</p>
			<p class="text-gray-300 text-sm">
				<b>Description:</b>
				{{ expense?.description || "No description" }}
			</p>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-2">Participants</h3>
			<div
				v-for="(p, index) in participants"
				:key="index"
				class="flex justify-between items-center p-3 mb-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
			>
				<div class="flex items-center space-x-3">
					<img
						:src="
							p.users.avatar
								? `/${p.users.avatar}`
								: '/default_avatar.png'
						"
						alt="avatar"
						class="w-10 h-10 rounded-full object-cover border border-gray-500"
					/>
					<div>
						<p class="font-medium">{{ p.users.name }}</p>
						<p class="text-sm text-gray-300">
							Owes: Rs. {{ p.expenseParticipantsTable.amountOwed
							}}<br />
							Paid: Rs.
							{{ p.expenseParticipantsTable.amountPaid }}
						</p>
					</div>
				</div>

				<div class="text-right">
					<span
						:class="
							p.expenseParticipantsTable.status === 'paid'
								? 'text-green-400 font-semibold'
								: 'text-yellow-400 font-semibold'
						"
					>
						{{ p.expenseParticipantsTable.status }}
					</span>

					<BaseButton
						variant="success"
						size="sm"
						v-if="
							p.expenseParticipantsTable.status !== 'paid' &&
							p.expenseParticipantsTable.userId === userId
						"
						@click="payAmount(p.expenseParticipantsTable.id)"
					>
						Pay
					</BaseButton>
				</div>
			</div>
		</div>

		<div class="mt-4 border-t border-gray-600 pt-3 text-right">
			<p class="text-gray-300">
				Remaining:
				<span class="text-red-400 font-semibold">
					Rs. {{ remainingAmount }}
				</span>
			</p>
		</div>

		<div v-if="fileName" class="mt-4">
			<img
				:src="`/api/files/${fileName}`"
				alt="Receipt Image"
				class="rounded-xl border border-gray-700"
			/>
		</div>
	</div>

	<div v-else class="text-center text-gray-400 mt-6">Loading expense...</div>

	<BaseModal :is-open="isOpen">
		<template #header> Pay the expense </template>
		<template #body>
			<ExpensePay
				:amount="formData.amount"
				:expense-id="formData.expenseId"
				:title="formData.title"
				@paid-successfully="paid"
			/>
		</template>
		<template #footer>
			<BaseButton variant="danger" @click="isOpen = false">
				Close
			</BaseButton>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
	import { ref, computed, reactive, onMounted, watch } from "vue";
	import { useRoute, useCookie, navigateTo } from "#imports";

	const token = useCookie("token");
	const route = useRoute();
	const id = route.params.id as string;

	const isOpen = ref(false);
	const fileName = ref<string | null>(null);

	interface User {
		userId: string;
		name: string;
		avatar: string;
	}

	interface ExpenseParticipant {
		id: string;
		expenseId: string;
		userId: string;
		amountOwed: string;
		amountPaid: string;
		status: string;
	}

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

	interface ExpenseData {
		expensesTable: Expense;
		expenseParticipantsTable: ExpenseParticipant;
		users: User;
	}

	const data = ref<ExpenseData[] | null>(null);
	const userId = ref("");

	const expense = computed(() => data.value?.[0]?.expensesTable ?? null);
	const participants = computed(() => data.value || []);

	const remainingAmount = computed(() =>
		participants.value
			.reduce(
				(sum, p) =>
					sum +
					parseFloat(p.expenseParticipantsTable.amountOwed) -
					parseFloat(p.expenseParticipantsTable.amountPaid),
				0
			)
			.toFixed(2)
	);

	const formatDate = (date?: string) =>
		date ? new Date(date).toLocaleDateString() : "";

	const formData = reactive({
		title: "",
		amount: "",
		expenseId: "",
	});

	watch(expense, (newExpense) => {
		if (newExpense) {
			formData.title = newExpense.title;
		}
	});

	const payAmount = (participantId: string) => {
		const participant = participants.value.find(
			(p) => p.expenseParticipantsTable.id === participantId
		);

		if (!participant || !expense.value) return;

		formData.amount = participant.expenseParticipantsTable.amountOwed;
		formData.expenseId = expense.value.id;
		formData.title = expense.value.title;

		isOpen.value = true;
	};

	onMounted(async () => {
		const getData = await $fetch<ExpenseData[]>(
			"/api/expenses/participants-exp-details",
			{
				method: "GET",
				query: { id },
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
			}
		);

		data.value = getData;

		if (data.value && data.value[0]?.expensesTable) {
			const receipt = await $fetch("/api/receipts", {
				query: { expenseId: data.value[0].expensesTable.id },
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
			});
			fileName.value = receipt?.fileUrl || null;
		}

		const user = await $fetch("/api/auth/verify-token", {
			headers: {
				Authorization: token.value ? `Bearer ${token.value}` : "",
			},
		});

		if (user?.data) userId.value = user.data.id;
	});
	function paid() {
		isOpen.value = false;
		navigateTo("/expenses");
	}
</script>
