<template>
	<!-- <spam class="hidden">{{ auth.initializeAuth() }}</spam> -->
	<div
		class="bg-slate-900 text-white min-h-screen min-w-screen p-4 font-mono"
	>
		<NavBar v-if="!auth.isLoggedIn" />
		<LoggedInNavBar v-else />
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
	import { useAuthStore } from "~/store/useAuthStore";

	const auth = useAuthStore();
</script>
