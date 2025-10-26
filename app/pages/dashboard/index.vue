<template>
	<BaseHeading>Dashboard</BaseHeading>
	<hr />
</template>

<script setup lang="ts">
	import { useAuthStore } from "~/store/useAuthStore";

	const token = useCookie("token");
	const auth = useAuthStore();
</script>
