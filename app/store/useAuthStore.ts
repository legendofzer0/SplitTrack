import type { Register } from "~/types/register";
import { defineStore } from "pinia";
import type { Login } from "~/types/login";
import { useBudgetStore } from "./useBudgetStore";
import { useExpenseStore } from "./useExpenseStore";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		isLoggedIn: false,
		token: "",
	}),
	actions: {
		async login(LoginData: Login) {
			try {
				const response = await $fetch("/api/auth/login", {
					method: "POST",
					body: LoginData,
				});
				if (response) {
					this.token = response?.token;
					this.isLoggedIn = true;
					const tokenCookie = useCookie("token", {
						maxAge: 7 * 24 * 60 * 60,
						sameSite: "strict",
					});
					tokenCookie.value = response?.token;
					return true;
				}
			} catch (err) {
				console.error("Login error:", err);
				throw err;
			}
		},

		async register(formData: Register) {
			const register = await $fetch("/api/auth/register", {
				method: "POST",
				body: formData,
			});

			return register;
		},

		async logout() {
			this.isLoggedIn = false;
			this.token = "";

			const tokenCookie = useCookie("token");
			tokenCookie.value = null;
			const budgetStore = useBudgetStore();
			const expenseStore = useExpenseStore();
			await budgetStore.clean();
			await expenseStore.clean();
			navigateTo("/");
		},

		initializeAuth() {
			const tokenCookie = useCookie("token");
			if (tokenCookie.value) {
				this.token = tokenCookie.value;
				this.isLoggedIn = true;
			}
		},
	},
});
