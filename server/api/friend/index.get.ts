import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { friendsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		console.log(event.context);
		const userId = event.context.user.id;
		const status = getQuery(event);
		console.log(status);
		const getFriends = await db.select().from(friendsTable).where(
			eq(friendsTable.userId, userId)
			// &&
			// eq(friendsTable.status, status)
		);
		if (getFriends.length > 0) {
			setResponseStatus(
				event,
				200,
				"Successfully found Friends and Friend requests"
			);
			return {
				requests: getFriends,
			};
		} else {
			setResponseStatus(
				event,
				404,
				"Friends and Friend requests not found"
			);
			return { message: "Friends and Friend requests not found" };
		}
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});
