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
		const token = useCookie("token");

		const { data, error } = await useFetch("/api/auth/verify-token", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token.value}`,
			},
		});

		if (error.value || !data.value?.isValid) {
			auth.logout();
		}
		return;
	} catch (err) {
		console.error("Token verification failed:", err);
		auth.logout();
	}
});
