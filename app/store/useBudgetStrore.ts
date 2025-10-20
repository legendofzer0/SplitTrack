import { defineStore } from "pinia";
export const useBudgetStore = defineStore("budget", {
	state: () => ({}),
	actions: {
		async getBudgets() {
			try {
				const token = useCookie("token");
				const { data, error } = await useFetch("/api/budget", {
					method: "get",
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
				console.log(data.value);
				return;
			} catch (error) {
				console.error("Error fetching budget:", error);
			}
		},
	},
});
