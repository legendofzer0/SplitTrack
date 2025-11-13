<template>
	<div>
		<form @submit.prevent="submit">
			<input
				type="file"
				accept="image/*"
				@input="handleFileInput"
				class="block w-full text-sm text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 focus:outline-none"
			/>

			<BaseButton
				size="sm"
				:is-full="true"
				variant="success"
				type="submit"
			>
				SAVE
			</BaseButton>
		</form>
	</div>
</template>

<script setup lang="ts">
	const { handleFileInput, files } = useFileStorage();
	const toast = useToast();
	const emit = defineEmits(["avatar-changed"]);
	const submit = async () => {
		try {
			const token = useCookie("token");
			if (!files.value.length) {
				toast.error({ message: "Please select an image first." });
				return;
			}

			await $fetch("/api/users/change-avatar", {
				method: "PATCH",
				body: { files: files.value },
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
			});

			toast.success({ message: "Avatar updated successfully!" });
			emit("avatar-changed");
		} catch (error) {
			console.error(error);
			toast.error({ message: "Failed to update avatar." });
		}
	};
</script>
