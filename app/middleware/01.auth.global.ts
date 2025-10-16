import { useAuthStore } from "~/store/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
	const auth = useAuthStore();

	const allowedURIs = ["/", "/about", "/auth/register", "/auth/login"];

	if (allowedURIs.includes(to.path)) {
		return;
	}

	if (auth.isLoggedIn) {
		return navigateTo("/auth/login");
	}

	//TODO : Add jwt verification here
	return;
});
