import type { Register } from "~/types/register";
import { defineStore } from "pinia";
import type { Login } from "~/types/login";

export const useAuthStore = defineStore("auth", {
	state: () => ({ isLoggedIn: false, token: "" }),
	actions: {
		async login(LoginData: Login) {
			try {
				const { data, error } = await useFetch("/api/auth/login", {
					method: "POST",
					body: LoginData,
				});

				if (error.value) {
					throw new Error("Invalid credentials or server error");
				}

				if (!data.value || !data.value.token) {
					throw new Error("Token not received from server");
				}
				this.token = data.value.token;
				this.isLoggedIn = true;
				localStorage.setItem("token", this.token);
				return true;
			} catch (err) {
				console.error("Login error:", err);
				throw err;
			}
		},

		async register(formData: Register) {
			const { data, error } = await useFetch("/api/auth/register", {
				method: "POST",
				body: formData,
			});

			if (error.value) {
				console.error("Registration failed:", error.value);
				throw error.value;
			}

			return data.value;
		},

		logout() {
			this.isLoggedIn = false;
			localStorage.removeItem("token");
			navigateTo("/");
		},

		initializeAuth() {
			if (import.meta.client) {
				const token = localStorage.getItem("token");
				if (token) {
					this.token = token;
					this.isLoggedIn = true;
				}
			}
		},
	},
});
