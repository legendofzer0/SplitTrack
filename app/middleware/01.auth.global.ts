import { useAuthStore } from "~/store/useAuthStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const auth = useAuthStore();

	const allowedURIs = ["/", "/about", "/auth/register", "/auth/login"];

	if (allowedURIs.includes(to.path)) {
		return;
	}

	if (!auth.isLoggedIn) {
		return navigateTo("/auth/login");
	}

	try {
		const token = auth.token;

		const { data, error } = await useFetch("/api/auth/verify-token", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (error.value || !data.value?.isValid) {
			auth.logout();
		}
	} catch (err) {
		console.error("Token verification failed:", err);
		auth.logout();
	}
});
