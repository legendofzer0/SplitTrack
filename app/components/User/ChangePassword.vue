<template>
	<form @submit.prevent="changePassword">
		<BaseInput
			v-model="formData.oldPassword"
			label="Old Password"
			:required-data="true"
			type="password"
		/>
		<BaseInput
			v-model="formData.newPassword"
			label="New Password"
			:required-data="true"
			type="password"
		/>
		<BaseButton variant="success" :is-full="true" type="submit">
			SAVE
		</BaseButton>
	</form>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { FetchError } from "ofetch";

	const toast = useToast();
	const emit = defineEmits(["password-changed"]);

	const formData = ref({
		oldPassword: "",
		newPassword: "",
	});

	async function changePassword() {
		try {
			const token = useCookie("token");

			const res = await $fetch("/api/users/change-password", {
				method: "PATCH",
				body: formData.value,
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
					"Content-Type": "application/json",
				},
			});

			toast.success({ message: "Password Changed Successfully" });
			emit("password-changed");

			formData.value.oldPassword = "";
			formData.value.newPassword = "";
		} catch (error) {
			if (error instanceof FetchError && error.statusCode === 400) {
				toast.error({ message: "Old Password is incorrect" });
			} else {
				console.error("An error occurred:", error);
				toast.error({
					message: "Something went wrong. Please try again.",
				});
			}
		}
	}
</script>
