import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { expenseParticipantsTable, expensesTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const getExpensesByCreator = await db
			.select()
			.from(expensesTable)
			.where(eq(expensesTable.creatorId, userId));
		const getExpensesForUser = await db
			.select()
			.from(expenseParticipantsTable)
			.innerJoin(
				expensesTable,
				eq(expenseParticipantsTable.expenseId, expensesTable.id)
			)
			.where(eq(expenseParticipantsTable.userId, userId));
		setResponseStatus(event, 200, "Successfully got data");

		return {
			ExpensesByCreator: getExpensesByCreator,
			ExpensesForUser: getExpensesForUser,
		};
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error: " + error,
		});
	}
});
