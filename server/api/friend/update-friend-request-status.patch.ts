import { eq, and } from "drizzle-orm";
import { db } from "~~/server/db";
import { friendsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const request = await readBody(event);

		const updated = await db
			.update(friendsTable)
			.set({ status: request.status })
			.where(eq(friendsTable.id, request.id))
			.returning();

		if (!updated.length) {
			throw createError({
				statusCode: 404,
				statusMessage: "Friend request not found",
			});
		}

		const updatedRequest = updated[0];
		if (updatedRequest.status === "accepted") {
			const existingReverse = await db
				.select()
				.from(friendsTable)
				.where(
					and(
						eq(friendsTable.userId, updatedRequest.friendUserId),
						eq(friendsTable.friendUserId, updatedRequest.userId)
					)
				);

			let reverseAction = null;

			if (existingReverse.length) {
				const reverse = existingReverse[0];

				if (reverse.status === "pending") {
					const updatedReverse = await db
						.update(friendsTable)
						.set({ status: "accepted" })
						.where(eq(friendsTable.id, reverse.id))
						.returning();

					reverseAction = {
						type: "updated_existing",
						data: updatedReverse[0],
					};
				} else {
					reverseAction = {
						type: "already_exists",
						data: reverse,
					};
				}
			} else {
				const createFriend = await db
					.insert(friendsTable)
					.values({
						userId: updatedRequest.friendUserId,
						friendUserId: updatedRequest.userId,
						token: updatedRequest.token,
						invitation_id: updatedRequest.invitation_id,
						status: "accepted",
					})
					.returning();

				if (!createFriend.length) {
					throw createError({
						statusCode: 500,
						statusMessage:
							"Failed to create reciprocal friendship entry",
					});
				}

				reverseAction = {
					type: "created_new",
					data: createFriend[0],
				};
			}

			return {
				success: true,
				message:
					"Friend request accepted and reciprocal relationship processed",
				data: {
					updated: updatedRequest,
					reverseAction,
				},
			};
		}

		return {
			success: true,
			message: `Friend request status updated to '${updatedRequest.status}'`,
			data: updatedRequest,
		};
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error: " + error.message,
		});
	}
});
