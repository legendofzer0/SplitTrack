import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const userDetails = await db
			.select({
				name: usersTable.name,
				phone_number: usersTable.phone_number,
				avatar: usersTable.avatar,
				email: usersTable.email,
			})
			.from(usersTable)
			.where(eq(usersTable.id, userId));
		if (userDetails) {
			setResponseStatus(event, 200, "Successfully got User Data");
			return {
				userDetails,
			};
		} else {
			setResponseStatus(event, 404, "User not found");
		}
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});
