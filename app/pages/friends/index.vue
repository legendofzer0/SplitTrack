<template>
	<BaseHeading>Friends</BaseHeading>
	<hr />
	<br />

	<FriendsSendRequest @friend-added="getFriends" />
	<br />
	<hr />
	<div
		class="m-2 flex items-center justify-center md:items-start md:justify-start"
	>
		<BaseChip
			:is-active="activeChip.pending"
			variant="secondary"
			@click="changeChip('pending')"
			>Pending</BaseChip
		>
		<BaseChip
			:is-active="activeChip.accepted"
			variant="success"
			@click="changeChip('accepted')"
			>Accepted</BaseChip
		>
		<BaseChip
			:is-active="activeChip.rejected"
			variant="danger"
			@click="changeChip('rejected')"
			>Rejected</BaseChip
		>
	</div>
	<br /><br />
	<div v-if="foundData">
		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
			<SentCard
				v-for="item in friendRequestData"
				:key="item.friendsTable.id"
				:friend="item"
			/>
		</div>
	</div>
	<div v-else>
		<BaseHeading variant="h3"> No Friends found</BaseHeading>
	</div>
</template>

<script setup lang="ts">
	import SentCard from "~/components/Friends/SentCard.vue";

	const type = ref("pending");
	const foundData = ref(true);
	const friendRequestData = ref();
	const activeChip = reactive({
		pending: true,
		accepted: false,
		rejected: false,
	});
	const token = useCookie("token");
	onMounted(() => {
		getFriends();
	});
	async function getFriends() {
		try {
			foundData.value = true;
			const getRequest = await $fetch("/api/friend/get-friends", {
				method: "get",
				query: {
					status: type.value,
				},
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
			});
			if (getRequest) {
				friendRequestData.value = getRequest.requests;
			}
		} catch (error) {
			console.error(error);
			friendRequestData.value = "";
			foundData.value = false;
		}
	}

	function changeChip(value: string) {
		for (const key in activeChip) {
			activeChip[key as keyof typeof activeChip] = key === value;
		}

		type.value = value;
		getFriends();
	}
</script>
