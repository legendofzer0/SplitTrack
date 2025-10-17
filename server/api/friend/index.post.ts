import { db } from "~~/server/db";
import { friendsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const data = await readBody(event);
		const addFriend = await db.insert(friendsTable).values({
			userId: userId,
			friendUserId: data.userId,
		});
		setResponseStatus(event, 200, "Successfully sent Friend request");
		return {
			message: "Successfully sent Friend request",
		};
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});
