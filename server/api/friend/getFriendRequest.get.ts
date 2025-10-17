import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { friendsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const getFriendRequests = await db
			.select()
			.from(friendsTable)
			.where(
				eq(friendsTable.friendUserId, userId) &&
					eq(friendsTable.status, "pending")
			);
		if (getFriendRequests.length > 0) {
			setResponseStatus(event, 200, "Successfully found Friend requests");
			return {
				requests: getFriendRequests,
			};
		} else {
			setResponseStatus(event, 404, "Friend requests not found");
			return { message: "Friend requests not found" };
		}
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});
