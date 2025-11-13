import { eq } from "drizzle-orm";
import { ServerFile } from "nuxt-file-storage";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const user_id = event.context.user.id;

		const { files } = await readBody<{ files: ServerFile[] }>(event);

		if (!files?.length) {
			throw createError({
				statusCode: 400,
				statusMessage: "No files received",
			});
		}

		let filename = "";

		for (const file of files) {
			if (!file.type.startsWith("image/")) {
				console.warn(`Skipping non-image file: ${file.name}`);
				continue;
			}

			filename = await storeFileLocally(file, 16, "/userAvatar");
		}

		if (!filename) {
			throw createError({
				statusCode: 500,
				statusMessage: "File not saved",
			});
		}

		await db
			.update(usersTable)
			.set({
				avatar: filename,
				is_default_avatar: false,
			})
			.where(eq(usersTable.id, user_id));

		return {
			message: "Avatar updated",
			fileUrl: `/userAvatar/${filename}`,
		};
	} catch (error) {
		console.error("Error saving avatar:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error",
		});
	}
});
