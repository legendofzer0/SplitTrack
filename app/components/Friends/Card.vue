<template>
	<div
		v-if="userData.id"
		class="mt-4 p-4 w-sm rounded-lg shadow-sm bg-slate-700 flex items-center space-x-4"
	>
		<img
			:src="userData.avatar"
			alt="User avatar"
			class="w-12 h-12 rounded-full object-cover border"
		/>
		<div>
			<p class="font-semibold text-white">{{ userData.name }}</p>
		</div>
		<div v-if="userData.isFriend">
			{{ userData.isFriend }}
			<BaseButton variant="success" size="sm">+</BaseButton>
		</div>
	</div>

	<p v-else class="mt-4 text-gray-500">No user found.</p>
</template>

<script setup lang="ts">
	interface User {
		id: string;
		name: string;
		avatar: string;
		isFriend: boolean;
	}
	defineProps<{ userData: User }>();
	async function sendFriendRequest() {}
</script>
