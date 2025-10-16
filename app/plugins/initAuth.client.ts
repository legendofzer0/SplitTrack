import { useAuthStore } from "~/store/useAuthStore";

export default defineNuxtPlugin(() => {
	const auth = useAuthStore();
	auth.initializeAuth();
});
