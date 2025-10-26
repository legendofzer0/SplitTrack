import { defineStore } from "pinia";

export const useExpenseStore = defineStore("expense", {
	state: () => ({
		expenseByUser: [] as any[],
		expenseForUser: [] as any[],
	}),

	actions: {
		async getExpenses() {
			try {
				const token = useCookie("token");

				const { data, error } = await useFetch("/api/expenses", {
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				});

				if (error.value) {
					console.error("Failed to fetch expenses:", error.value);
					throw error.value;
				}

				if (!data.value) {
					console.warn("No expense data received");
					return;
				}

				this.expenseByUser = data.value.ExpensesByUser ?? [];
				this.expenseForUser = data.value.ExpensesForUser ?? [];
			} catch (err) {
				console.error("Error fetching expenses:", err);
			}
		},

		async getExpenseById(id: string) {
			let expense =
				this.expenseByUser.find((e) => e.id === id) ||
				this.expenseForUser.find((e) => e.expenseId === id);

			if (expense) return expense;

			try {
				const token = useCookie("token");

				const { data, error } = await useFetch(`/api/expenses/${id}`, {
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				});

				if (error.value) {
					console.error("API fetch error:", error.value);
					throw error.value;
				}

				if (!data.value) {
					throw createError({
						statusCode: 404,
						statusMessage: "Expense not found",
					});
				}

				const fetchedExpense = data.value;
				return fetchedExpense;
			} catch (err: any) {
				if (err.statusCode === 404) {
					console.warn("Expense not found:", id);
				} else {
					console.error("Error fetching expense by ID:", err);
				}
				throw err;
			}
		},
	},
});
