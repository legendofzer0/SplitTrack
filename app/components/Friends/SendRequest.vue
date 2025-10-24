<template>
	<div class="inline-flex items-center space-x-2">
		<BaseInput
			id="searchValue"
			v-model="searchValue"
			placeholder="Email Address"
			:is-inline="false"
		/>
		<BaseButton @click="searchUser" variant="secondary" size="md">
			Search
		</BaseButton>
	</div>
	<FriendsCard :user-data="userData" />
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	import { useFetch, useCookie } from "#app";

	interface User {
		id: string;
		name: string;
		avatar: string;
		isFriend: boolean;
	}

	const searchValue = ref("");
	const userData = reactive<User>({
		id: "",
		name: "",
		avatar: "",
		isFriend: false,
	});

	function resetUserData() {
		Object.assign(userData, { id: "", name: "", avatar: "" });
	}

	async function searchUser() {
		const token = useCookie("token");

		const { data, error } = await useFetch<User[] | User>(
			"/api/friend/get-user-data-email",
			{
				method: "POST",
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
				body: { email: searchValue.value },
			}
		);

		if (error.value) {
			console.error("Failed to fetch user:", error.value);
			resetUserData();
			return;
		}

		if (!data.value) {
			console.warn("No user data received");
			resetUserData();
			return;
		}

		const user = Array.isArray(data.value)
			? data.value[0]
			: (data.value as User);

		if (!user || !user.id) {
			resetUserData();
			return;
		}

		Object.assign(userData, user);
	}
</script>
