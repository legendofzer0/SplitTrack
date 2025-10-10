<template>
	<nav class="bg-white dark:bg-gray-900 shadow-md">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex-shrink-0 flex items-center">
					<span
						class="text-2xl font-bold text-blue-600 dark:text-blue-400"
						>Split Track</span
					>
				</div>

				<div
					class="hidden md:flex md:items-center md:space-x-6 font-medium"
				>
					<BaseLink to="/"> Home </BaseLink>

					<BaseLink to="/auth/login">Login</BaseLink>

					<BaseButton @click="navigateToRegister()">
						Get Started
					</BaseButton>
				</div>

				<div class="flex items-center md:hidden">
					<button
						@click="isOpen = !isOpen"
						class="md:hidden p-2 rounded-md"
					>
						<HamburgerOption :isOpen="isOpen" />
					</button>
				</div>
			</div>
		</div>

		<div
			v-if="isOpen"
			class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
		>
			<div class="px-2 pt-2 pb-3 space-y-1">
				<BaseLink to="/" @click="isOpen = false" :isFull="true">
					Home
				</BaseLink>
				<BaseLink
					to="/auth/login"
					@click="isOpen = false"
					:isFull="true"
					>Login</BaseLink
				>
				<BaseButton :isFull="true" @click="navigateToRegister()">
					Get Started
				</BaseButton>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	const isOpen = ref(false);

	function navigateToRegister(): void {
		navigateTo("/auth/register");
		isOpen.value = false;
	}
</script>
