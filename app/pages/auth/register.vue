<template>
	<div
		class="container border rounded-2xl p-5 my-20 md:mx-auto md:m-20 md:self-center md:w-3xl"
	>
		<BaseHeading>Register</BaseHeading>

		<form @submit.prevent="submitForm()">
			<BaseInput
				id="name"
				label="Name:"
				v-model="formData.name"
				type="text"
				:error="errorData.name"
				:required-data="true"
			/>
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
			<BaseInput
				id="confirmPassword"
				label="Conform Password:"
				v-model="confirmPassword"
				type="password"
				:error="errorData.conformPassword"
				:required-data="true"
			/>
			<BaseInput
				id="phoneNumber"
				label="Phone Number:"
				v-model="formData.phone_number"
				type="tel"
				:error="errorData.phone_number"
				:required-data="true"
			/>

			<BaseButton type="submit" :is-full="true" variant="success"
				>Submit</BaseButton
			>
		</form>
		<p>
			Already have a account
			<BaseLink to="/auth/login" variant="inline">Login</BaseLink>
		</p>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	import emailPattern from "~/const/EMAIL_REGEX";
	import PASSWORD_REGEX from "~/const/PASSWORD_REGEX";
	import { useAuthStore } from "~/store/useAuthStore";
	const toast = useToast();
	const formData = reactive({
		email: "",
		password: "",
		name: "",
		phone_number: "",
	});
	const errorData = reactive({
		email: "",
		password: "",
		conformPassword: "",
		name: "",
		phone_number: "",
	});
	const confirmPassword = ref("");
	const auth = useAuthStore();

	if (auth.isLoggedIn) {
		navigateTo("/dashboard");
	}

	async function submitForm() {
		errorData.email = "";
		errorData.password = "";
		errorData.name = "";
		errorData.phone_number = "";

		let isValid = true;

		if (!formData.name.trim()) {
			errorData.name = "Name is required.";
			isValid = false;
		}
		if (!formData.email.trim()) {
			errorData.email = "Email is required.";
			isValid = false;
		}
		if (!formData.password.trim()) {
			errorData.password = "Password is required.";
			isValid = false;
		}
		if (!formData.phone_number.trim()) {
			errorData.phone_number = "Phone number is required.";
			isValid = false;
		}
		if (!confirmPassword.value.trim()) {
			errorData.conformPassword = "Confirm password is required.";
			isValid = false;
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

		if (
			formData.password &&
			confirmPassword.value &&
			formData.password !== confirmPassword.value
		) {
			errorData.password = "Passwords do not match.";
			isValid = false;
		}

		if (isValid) {
			try {
				try {
					const response = await auth.register(formData);
					toast.success({
						title: "Success",
						message: "User Registration sucessfull",
					});
					navigateTo("/auth/login");
				} catch (err) {
					console.error("Registration failed:", err);
					toast.error({
						title: "error",
						message: "User Registration failed",
					});
				}
			} catch (error) {
				console.error(error);
			}
		}
	}
</script>
