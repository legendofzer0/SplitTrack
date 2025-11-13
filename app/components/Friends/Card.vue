<template>
	<div
		v-if="userData.id"
		class="mt-4 p-4 w-sm rounded-lg shadow-sm bg-slate-700 flex items-center space-x-4"
	>
		<FriendsImage
			:is_default="userData.is_default"
			:avatar="userData.avatar"
		/>
		<div>
			<p class="font-semibold text-white">{{ userData.name }}</p>
		</div>
		<div v-if="!userData.isFriend">
			<BaseButton @click="sendFriendRequest()" variant="success" size="md"
				>+</BaseButton
			>
		</div>
		<div v-else>
			<span
				:class="{
					'text-gray-500 italic': userData.status === 'pending',
					'text-green-600 italic': userData.status === 'accepted',
					'text-red-700 italic':
						userData.status === 'blocked' ||
						userData.status === 'rejected',
				}"
			>
				{{ userData.status }}
			</span>
		</div>
	</div>

	<div v-else class="mt-4 text-gray-500">
		<p v-if="email.length !== 0">No user found.</p>
	</div>
</template>

<script setup lang="ts">
	interface User {
		id: string;
		name: string;
		avatar: string;
		isFriend: boolean;
		is_default: boolean;
		status?: string;
	}
	const props = defineProps<{ userData: User; email: string }>();

	async function sendFriendRequest() {
		const token = useCookie("token");
		const toast = useToast();
		try {
			const request = await $fetch("/api/friend/send-friend-request", {
				method: "post",
				body: {
					friend_id: props.userData.id,
					email: props.email,
				},
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
			});
			if (request?.message === "Invitation sent") {
				(props.userData.isFriend = true),
					(props.userData.status = "pending");
				toast.success({ message: "Friend request sent successfully" });
				emit("friend-added");
			} else {
				toast.error({ message: "Friend request couldn't be sent" });
			}
		} catch (error) {
			console.log(error);
		}
	}
	const emit = defineEmits(["friend-added"]);
</script>
