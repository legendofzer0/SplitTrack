<template>
	<div class="relative inline-block w-full">
		<label class="block mb-2 font-medium text-white">Select Users:</label>

		<div
			class="border rounded cursor-pointer p-2 bg-slate-700 text-white"
			@click="open = !open"
		>
			Select users...
		</div>

		<div
			v-if="open"
			class="absolute z-10 mt-1 w-full border rounded bg-slate-800 shadow p-2 max-h-48 overflow-y-auto"
		>
			<div
				v-for="user in userData"
				:key="user.id"
				class="flex items-center space-x-2 py-1 cursor-pointer"
				@click="toggleUser(user.id, user.name)"
			>
				<input
					type="checkbox"
					:checked="user.id in selectedUsers"
					@change="toggleUser(user.id, user.name)"
				/>
				<img
					:src="`/${user.avatar}`"
					alt="avatar"
					class="w-6 h-6 rounded-full"
				/>
				<label class="text-white">{{ user.name }}</label>
			</div>

			<button
				type="button"
				class="mt-2 w-full border rounded p-1 text-sm bg-slate-600 hover:bg-slate-500 text-white"
				@click="open = false"
			>
				Done
			</button>
		</div>
		<div class="mt-3 text-white">
			<p class="font-medium">Selected Users:</p>
			<span v-if="Object.keys(selectedUsers).length">
				{{ Object.values(selectedUsers).join(", ") }}
			</span>
			<p v-else class="text-gray-400">None selected</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	const open = ref(false);
	const selectedUsers = ref<Record<string, string>>({});

	interface UserType {
		id: string;
		avatar: string;
		name: string;
	}

	const props = defineProps<{ userData: UserType[]; error: string }>();
	const emit = defineEmits(["update:selected"]);

	function emitSelection() {
		emit("update:selected", selectedUsers.value);
	}

	function toggleUser(userId: string, name: string) {
		if (userId in selectedUsers.value) {
			delete selectedUsers.value[userId];
		} else {
			selectedUsers.value[userId] = name;
		}

		selectedUsers.value = { ...selectedUsers.value };

		emitSelection();
	}
</script>
