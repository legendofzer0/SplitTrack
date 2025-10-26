import { defineStore } from "pinia";

export const useBudgetStore = defineStore("budget", {
	state: () => ({
		budgetData: [] as any[],
	}),
	actions: {
		async clean() {
			this.budgetData = [];
		},
		async getBudgets() {
			try {
				const token = useCookie("token");

				const { data, error } = await useFetch("/api/budget", {
					method: "GET",
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				});

				if (error.value) {
					console.error("Failed to fetch budgets:", error.value);
					throw error.value;
				}

				if (!data.value) {
					console.warn("No budget data received");
					return;
				}
				this.budgetData = data.value.data || {};
				return data.value;
			} catch (error) {
				console.error("Error fetching budget:", error);
			}
		},

		async createBudgets(payload: BudgetPayload) {
			try {
				const token = useCookie("token");

				const { data, error } = await useFetch("/api/budget", {
					method: "POST",
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
						"Content-Type": "application/json",
					},
					body: payload,
				});

				if (error.value) {
					console.error("Failed to create budget:", error.value);
					throw error.value;
				}
				this.budgetData.push(data.value?.createdBudget);
				return data.value;
			} catch (error) {
				console.error("Error creating budget:", error);
			}
		},
	},
});

interface BudgetPayload {
	title: string;
	totalAmount: number;
	currency: string;
}
