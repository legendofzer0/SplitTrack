<template>
	<div class="inline-flex items-center space-x-2">
		<BaseInput
			id="searchValue"
			v-model="searchValue"
			placeholder="Email Address"
			:is-inline="false"
			@keyup.enter="searchUser"
		/>
		<BaseButton @click="searchUser" variant="secondary" size="md">
			Search
		</BaseButton>
	</div>
	<FriendsCard
		:user-data="userData"
		:email="searchValue"
		@friend-added="friendAdded"
	/>
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	import { useFetch, useCookie } from "#app";

	interface User {
		id: string;
		name: string;
		avatar: string;
		isFriend: boolean;
		is_default: boolean;
	}

	const searchValue = ref("");
	const userData = reactive<User>({
		id: "",
		name: "",
		avatar: "",
		isFriend: false,
		is_default: true,
	});

	function resetUserData() {
		Object.assign(userData, { id: "", name: "", avatar: "" });
	}

	async function searchUser() {
		try {
			const token = useCookie("token");

			const response = await $fetch("/api/friend/get-user-data-email", {
				method: "POST",
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
				body: { email: searchValue.value },
			});
			if (response) {
				Object.assign(userData, { ...response });
			}
		} catch (error) {
			resetUserData();
		}
	}
	function friendAdded() {
		emit("friend-added");
	}
	const emit = defineEmits(["friend-added"]);
</script>
