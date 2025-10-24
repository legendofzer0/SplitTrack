<template>
	<BaseHeading>Dashboard</BaseHeading>
	<hr />
</template>

<script setup lang="ts">
	import { useAuthStore } from "~/store/useAuthStore";

	const token = useCookie("token");
	console.log(token.value);
	const auth = useAuthStore();
	console.log("token");
	console.log(auth.token);
</script>
