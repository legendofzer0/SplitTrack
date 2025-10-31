import { generateToken } from "~~/server/utils/JWT_Utility";
import { friendsTable, invitationsTable } from "./../../db/schemas";
import { db } from "~~/server/db";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	try {
		const request = await readBody(event);
		const userId = event.context.user.id || "";

		if (userId === request.friend_id) {
			setResponseStatus(event, 400, "Cannot send invite to yourself");
			return { message: "Cannot send invite to yourself" };
		}

		const token = generateToken(userId, request.email);
		console.log(request);
		const test = await db
			.select()
			.from(invitationsTable)
			.where(
				and(
					eq(invitationsTable.id, userId),
					eq(invitationsTable.inviteeEmail, request.email)
				)
			);

		if (test.length !== 0) {
			setResponseStatus(event, 400, "Invitation already exists");
			return;
		}

		const invitation = await db
			.insert(invitationsTable)
			.values({
				inviterId: userId,
				inviteeEmail: request.email,
				token,
			})
			.returning({
				id: invitationsTable.id,
				token: invitationsTable.token,
			});

		const addFriend = await db.insert(friendsTable).values({
			userId,
			token: invitation[0].token,
			invitation_id: invitation[0].id,
			friendUserId: request.friend_id,
		});
		return {
			message: "Invitation sent",
		};
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});
