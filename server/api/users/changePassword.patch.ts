import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const passwordData = await readBody(event);

		const getHashedPassword = await db
			.select({ password: usersTable.password })
			.from(usersTable)
			.where(eq(usersTable.id, userId));
		const isCorrectPassword = await comparePassword(
			passwordData.oldPassword,
			getHashedPassword[0].password
		);

		if (isCorrectPassword) {
			const hashedPassword = await generateHashedPassword(
				passwordData.newPassword
			);
			await db
				.update(usersTable)
				.set({ password: hashedPassword })
				.where(eq(usersTable.id, userId));

			setResponseStatus(event, 200, "Password changed successfully");
		} else {
			setResponseStatus(event, 400, "Old password was incorrect");
		}
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});
