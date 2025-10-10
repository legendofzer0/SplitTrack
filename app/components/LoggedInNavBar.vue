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
					<NuxtLink
						to="/"
						class="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
						active-class="bg-gray-200 dark:bg-gray-800"
					>
						Home
					</NuxtLink>

					<NuxtLink
						to="#"
						class="hover:text-blue-600 dark:hover:text-blue-400"
						>Contact</NuxtLink
					>
					<button
						class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
						@click="navigateToRegister()"
					>
						Get Started
					</button>
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
				<NuxtLink
					to="/"
					class="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
					active-class="bg-gray-200 dark:bg-gray-800"
				>
					Home
				</NuxtLink>

				<NuxtLink
					to="#"
					class="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
					>Contact</NuxtLink
				>
				<button
					class="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
					@click="navigateToRegister()"
				>
					Get Started
				</button>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	const isOpen = ref(false);

	function navigateToRegister(): void {
		navigateTo("/auth/register");
	}
</script>
