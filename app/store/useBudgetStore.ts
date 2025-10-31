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

				const getBudgetData = await $fetch("/api/budget", {
					method: "GET",
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				});

				this.budgetData = getBudgetData.data;
			} catch (error) {
				console.error("Error fetching budget:", error);
			}
		},

		async createBudgets(payload: BudgetPayload) {
			try {
				const token = useCookie("token");

				const response = await $fetch("/api/budget", {
					method: "POST",
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
						"Content-Type": "application/json",
					},
					body: { ...payload, remainingAmount: payload.totalAmount },
				});
				this.budgetData.push(response.createdBudget[0]);
				return true;
			} catch (error) {
				console.error("Error creating budget:", error);
				return false;
			}
		},
	},
});

interface BudgetPayload {
	title: string;
	totalAmount: number;
	currency: string;
}
