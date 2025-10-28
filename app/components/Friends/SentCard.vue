<template>
	<div
		class="flex items-center justify-between p-4 bg-slate-800 rounded-2xl shadow-md border border-slate-700 hover:shadow-lg transition"
	>
		<div class="flex items-center gap-3">
			<img
				:src="`/${friend.avatar}`"
				alt="Avatar"
				class="w-12 h-12 rounded-full object-cover border border-slate-600"
			/>
			<div>
				<h2 class="text-white font-semibold text-lg">
					{{ friend.name }}
				</h2>
				<p class="text-gray-400 text-sm">
					{{ friend.email }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		friend: FriendData;
	}>();

	interface FriendData {
		friendsTable: Record<string, string>;
		name: string;
		email: string;
		avatar: string;
	}
</script>
