import type { Register } from "~/types/register";
import { defineStore } from "pinia";
import type { Login } from "~/types/login";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		isLoggedIn: false,
		token: "",
	}),
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
				const tokenCookie = useCookie("token", {
					maxAge: 7 * 24 * 60 * 60, // 7 days expires in
					sameSite: "strict",
				});
				tokenCookie.value = this.token;

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
			this.token = "";

			const tokenCookie = useCookie("token");
			tokenCookie.value = null;

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
