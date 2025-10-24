import { useAuthStore } from "~/store/useAuthStore";
import { useBudgetStore } from "~/store/useBudgetStrore";
import { useExpenseStore } from "~/store/useExpenseStore";

export default defineNuxtPlugin(() => {
	const auth = useAuthStore();
	const expense = useExpenseStore();
	const budget = useBudgetStore();
	auth.initializeAuth();
	expense.getExpenses();
	budget.getBudgets();
});
