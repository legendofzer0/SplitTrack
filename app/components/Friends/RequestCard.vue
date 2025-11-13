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
			<div>
				<BaseButton
					variant="success"
					size="sm"
					@click="openModel('accept')"
					>Accept</BaseButton
				>
				<BaseButton
					variant="danger"
					size="sm"
					@click="openModel('reject')"
					>Reject</BaseButton
				>
			</div>
		</div>
	</div>

	<BaseModal :isOpen="showModal">
		<template #header>
			<h3 class="text-xl font-bold">Are you sure?</h3>
		</template>

		<template #body>
			<p>
				Are you sure u want to
				<span
					:class="[
						'bold italic',
						whatToDo === 'accept'
							? 'text-green-600'
							: 'text-red-600',
					]"
				>
					{{ whatToDo }}
				</span>
				this request
			</p>
		</template>

		<template #footer>
			<BaseButton variant="danger" @click="showModal = false">
				Close
			</BaseButton>
			<BaseButton variant="success" @click="changeStatus(whatToDo)">
				Yes
			</BaseButton>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
	import BaseModal from "~/components/Base/Modal.vue";
	const whatToDo = ref("accept");
	const showModal = ref(false);

	const props = defineProps<{
		friend: FriendData;
	}>();

	function openModel(value: string) {
		whatToDo.value = value;
		showModal.value = true;
	}
	const changeStatus = async (value: string) => {
		var status = "accepted";
		if (value === "reject") {
			status = "rejected";
		}
		const token = useCookie("token");

		try {
			const change = await $fetch(
				"/api/friend/update-friend-request-status",
				{
					method: "patch",
					body: {
						status,
						id: props.friend.friendsTable.id,
					},
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
						"Content-Type": "application/json",
					},
				}
			);
			if (change.success) {
				emit("statusChanged");
			}
			showModal.value = false;
		} catch (error) {
			console.log(error);
		}
	};

	const emit = defineEmits(["statusChanged"]);
	interface FriendData {
		friendsTable: Record<string, string>;
		name: string;
		email: string;
		avatar: string;
		is_default: boolean;
	}
</script>
