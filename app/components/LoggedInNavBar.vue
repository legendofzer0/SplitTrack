<template>
	<nav class="bg-gray-900 shadow-md">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex-shrink-0 flex items-center">
					<span class="text-2xl font-bold text-blue-400"
						>Split Track
					</span>
				</div>

				<div
					class="hidden md:flex md:items-center md:space-x-6 font-medium"
				>
					<BaseLink to="/dashboard"> Dashboard </BaseLink>
					<BaseLink to="/expenses"> Expense </BaseLink>
					<BaseLink to="/budget"> Budget </BaseLink>
					<div class="relative group">
						<BaseButton variant="plain"> Friends ▾ </BaseButton>

						<div
							class="absolute left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"
						>
							<BaseLink :isFull="true" to="/friends">
								My Friend
							</BaseLink>
							<BaseLink :isFull="true" to="/friends/requests">
								Friend Requests
							</BaseLink>
						</div>
					</div>

					<BaseButton variant="danger" @click="auth.logout()"
						>Logout</BaseButton
					>
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
			class="md:hidden bg-gray-800 border-t border-gray-700"
		>
			<div class="px-2 pt-2 pb-3 space-y-1">
				<BaseLink to="/" @click="isOpen = false" :isFull="true">
					Dashboard
				</BaseLink>
				<BaseLink to="/Expenses" @click="isOpen = false" :isFull="true">
					Expense
				</BaseLink>
				<BaseLink to="/budget" @click="isOpen = false" :isFull="true">
					Budget
				</BaseLink>
				<div class="relative group">
					<BaseButton variant="plain" :isFull="true">
						Friends ▾
					</BaseButton>

					<div
						class="absolute left-0 mt-2 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"
					>
						<BaseLink :isFull="true" to="/friends">
							My Friend
						</BaseLink>
						<BaseLink :isFull="true" to="/friends/requests">
							Friend Requests
						</BaseLink>
					</div>
				</div>
				<BaseButton
					variant="danger"
					@click="auth.logout()"
					:isFull="true"
					>Logout</BaseButton
				>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useAuthStore } from "~/store/useAuthStore";
	const isOpen = ref(false);
	const auth = useAuthStore();
</script>
