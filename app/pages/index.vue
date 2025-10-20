<template>
	<div class="container">
		<BaseHeading> Spit Track </BaseHeading>
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
	if (auth.isLoggedIn) {
		navigateTo("/dashboard");
	}
</script>
