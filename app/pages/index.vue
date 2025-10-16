<template>
	<div class="container">
		<h1 class="text-center md:text-left md:m-2 md:p-2 text-5xl">
			Spit Track
		</h1>
		<p class="m-1 p-2">
			Split Track is a budgeting and bill-splitting app designed to help
			users track expenses, manage budgets, and fairly split bills among
			friends or groups.
		</p>
		<BaseButton v-if="!auth.isLoggedIn" @click="navigateToRegister()">
			Get Started
		</BaseButton>
		<BaseButton variant="secondary"> Learn More </BaseButton>
	</div>
</template>

<script setup lang="ts">
	import { useAuthStore } from "~/store/useAuthStore";

	function navigateToRegister(): void {
		navigateTo("/auth/register");
	}
	const auth = useAuthStore();
</script>
