<template>
	<div class="grid grid-cols-1 md:grid-cols-3">
		<UserTotal />
		<BaseButton
			variant="primary"
			size="sm"
			@click="changePasswordModelIsOpen = true"
			>Change Password</BaseButton
		>
		<BaseButton
			variant="secondary"
			size="sm"
			@click="changeAvatarModelIsOpen = true"
			>Change Avatar</BaseButton
		>
	</div>
	<BaseModal :is-open="changePasswordModelIsOpen">
		<template #header>
			<div class="flex items-center justify-between px-4 py-2 border-b">
				<BaseHeading variant="h2"> Change Password </BaseHeading>
			</div>
		</template>

		<template #body>
			<div class="h-l overflow-auto">
				<UserChangePassword
					@password-changed="changePasswordModelIsOpen = false"
				/>
			</div>
		</template>
		<template #footer>
			<BaseButton
				variant="danger"
				@click="changePasswordModelIsOpen = false"
			>
				Close
			</BaseButton>
		</template>
	</BaseModal>
	<BaseModal :is-open="changeAvatarModelIsOpen">
		<template #header>
			<div class="flex items-center justify-between px-4 py-2 border-b">
				<BaseHeading variant="h2"> Change Avatar </BaseHeading>
			</div>
		</template>

		<template #body>
			<div class="h-l overflow-auto">
				<UserChangeAvatar
					@avatar-changed="changeAvatarModelIsOpen = false"
				/>
			</div>
		</template>
		<template #footer>
			<BaseButton
				variant="danger"
				@click="changeAvatarModelIsOpen = false"
			>
				Close
			</BaseButton>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
	const changePasswordModelIsOpen = ref(false);
	const changeAvatarModelIsOpen = ref(false);
</script>
