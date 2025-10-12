import type { Register } from "~/types/register";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
	state: () => ({ isLoggedIn: false, token: "" }),
	actions: {
		login() {
			this.isLoggedIn = true;
			this.token = "FakeToken";
			localStorage.setItem("token", this.token);
		},
		async register(formData: Register) {
			const { data, error } = await useFetch("/api/auth/register", {
				method: "POST",
				body: formData,
			});
			console.log(data);
			console.log(error);

			if (error.value) {
				console.error(
					"Registration failed:",
					error.value.data?.message || error.value
				);
				return {
					success: false,
					message: error.value.data?.message || "Registration failed",
				};
			}

			return {
				success: true,
				message: data.value?.message || "User registered successfully",
			};
		},

		logout() {
			this.isLoggedIn = false;
			localStorage.removeItem("token");
		},
	},
});
