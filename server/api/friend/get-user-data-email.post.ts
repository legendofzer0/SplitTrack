import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { friendsTable, usersTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const reqBody = await readBody(event);
		const userId = event.context.user.id;
		const user = await db
			.select({
				id: usersTable.id,
				avatar: usersTable.avatar,
				name: usersTable.name,
			})
			.from(usersTable)
			.where(eq(usersTable.email, reqBody.email));
		if (!user) {
			setResponseStatus(event, 404, "User not found");
			return {
				message: "User not found",
			};
		}

		const userData = user[0];
		if (userData.id === userId) {
			setResponseStatus(event, 400, "Logged is user is the user");
			return {
				message: "Logged is user is the user",
			};
		}

		const check = await db
			.select()
			.from(friendsTable)
			.where(
				eq(friendsTable.friendUserId, userData.id) &&
					eq(friendsTable.userId, userId)
			);
		if (check) {
			return {
				...userData,
				isFriend: true,
			};
		}
		return {
			...userData,
			isFriend: false,
		};
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});
