import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { friendsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const request = await readBody(event);
		await db
			.update(friendsTable)
			.set({
				status: request.status,
			})
			.where(eq(friendsTable.id, request.id));
		setResponseStatus(
			event,
			200,
			"Friend Request status successfully updated"
		);
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});
