<template>
	<div
		class="flex items-center justify-between p-4 bg-slate-800 rounded-2xl shadow-md border border-slate-700 hover:shadow-lg transition"
	>
		<div class="flex items-center gap-3">
			<FriendsImage
				:is_default="friend.is_default"
				:avatar="friend.avatar"
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
		is_default: boolean;
	}
</script>
