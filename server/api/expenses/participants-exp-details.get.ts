import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import {
	expenseParticipantsTable,
	expensesTable,
	usersTable,
} from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);

		if (!query.id || Array.isArray(query.id)) {
			throw new Error("Invalid expense ID");
		}

		const getExpenseDetails = await db
			.select({
				expensesTable,
				expenseParticipantsTable,
				users: {
					userId: usersTable.id,
					name: usersTable.name,
					avatar: usersTable.avatar,
				},
			})
			.from(expensesTable)
			.where(eq(expensesTable.id, query.id as string))
			.leftJoin(
				expenseParticipantsTable,
				eq(expenseParticipantsTable.expenseId, expensesTable.id)
			)
			.fullJoin(
				usersTable,
				eq(usersTable.id, expenseParticipantsTable.userId)
			);
		return getExpenseDetails;
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});
