<template>
	<div
		class="container border rounded-2xl p-5 my-20 md:mx-auto md:m-20 md:w-3xl md:self-center"
	>
		<h1 class="text-center text-2xl font-black">Login</h1>
		<form @submit.prevent="login()">
			<BaseInput
				id="email"
				label="Email:"
				v-model="formData.email"
				type="text"
				:error="errorData.email"
				:required-data="true"
			/>
			<BaseInput
				id="password"
				label="Password:"
				v-model="formData.password"
				type="password"
				:error="errorData.password"
				:required-data="true"
			/>
			<BaseButton type="submit" variant="success" :is-full="true"
				>Login</BaseButton
			>
		</form>
	</div>
</template>

<script setup lang="ts">
	import { reactive } from "vue";
	import emailPattern from "~/const/EMAIL_REGEX";
	import PASSWORD_REGEX from "~/const/PASSWORD_REGEX";
	const formData = reactive({
		email: "",
		password: "",
	});
	const errorData = reactive({
		email: "",
		password: "",
	});

	function login() {
		var isValid = true;
		errorData.email = "";
		errorData.password = "";

		if (!formData.email.trim()) {
			errorData.email = "Email is required";
		}
		if (!formData.password.trim()) {
			errorData.password = "Password is required";
		}
		if (formData.email && !emailPattern.test(formData.email)) {
			errorData.email = "Invalid email format.";
			isValid = false;
		}
		if (formData.password && !PASSWORD_REGEX.test(formData.password)) {
			const errorMessage =
				"Password should be 8–16 characters long,\n" +
				"at least 1 capital letter,\n" +
				"at least 1 number, and\n" +
				"at least 1 symbol from @, #, $, or %.";

			errorData.password = errorMessage;
			isValid = false;
		}
		if (isValid) {
			console.log(formData);
		}
	}
</script>
