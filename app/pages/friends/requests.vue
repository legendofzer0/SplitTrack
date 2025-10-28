<template>
	<BaseHeading> Friend Requests </BaseHeading>
	<hr />
	<div v-if="foundData">
		<div class="m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
			<RequestCard
				v-for="item in friendRequestData"
				:key="item.friendsTable.id"
				:friend="item"
				@status-changed="statusChanged"
			/>
		</div>
	</div>
	<div v-else>
		<BaseHeading variant="h3"> No Friends found</BaseHeading>
	</div>
</template>

<script setup lang="ts">
	import RequestCard from "~/components/Friends/RequestCard.vue";
	const friendRequestData = ref();
	const foundData = ref(true);

	const token = useCookie("token");
	const friendRequest = async () => {
		try {
			foundData.value = true;

			const requestData = await $fetch(
				"/api/friend/get-friend-requests",
				{
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				}
			);
			friendRequestData.value = requestData.requests;
		} catch (error) {
			console.log(error);
			foundData.value = false;
		}
	};
	function statusChanged() {
		friendRequest();
	}

	onMounted(() => {
		friendRequest();
	});
</script>
