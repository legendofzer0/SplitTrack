import { defineStore } from "pinia";

export const useExpenseStore = defineStore("expense", {
	state: () => ({
		expenseByUser: [] as any[],
		expenseForUser: [] as any[],
	}),

	actions: {
		async clean() {
			this.expenseByUser = [];
			this.expenseForUser = [];
		},
		async getExpenses() {
			try {
				const token = useCookie("token");

				const getExpenseData = await $fetch("/api/expenses", {
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				});

				if (
					getExpenseData.ExpensesByUser.length ||
					getExpenseData.ExpensesForUser.length
				) {
					this.expenseByUser = [];
					this.expenseForUser = [];
				}
				this.expenseByUser = getExpenseData.ExpensesByUser;
				this.expenseForUser = getExpenseData.ExpensesForUser;
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

				const getExpenseFromID = await $fetch(`/api/expenses/${id}`, {
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				});

				console.log(getExpenseFromID);
			} catch (err: any) {
				if (err.statusCode === 404) {
					console.warn("Expense not found:", id);
				} else {
					console.error("Error fetching expense by ID:", err);
				}
				throw err;
			}
		},

		async submit(formData: formDataStructure) {
			const token = useCookie("token");
			const submit = await $fetch("/api/expenses", {
				method: "POST",
				body: formData,
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
			});
			console.log(submit);
			const newExpense = submit.insertIntroExpenseTable?.[0];
			if (newExpense) {
				this.expenseByUser.push(newExpense);
			} else {
				console.warn("No new expense returned from API");
			}

			return true;
		},
	},
});

interface formDataStructure {
	budget_id: string;
	creator_id: string;
	amount: number;
	title: string;
	description: string;
	date: string;
	split_type: string;
	split_data: Object;
}
