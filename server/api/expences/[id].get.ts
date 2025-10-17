import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { expenseParticipantsTable, expensesTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	const expenseId = getRouterParam(event, "id");
	if (!expenseId) return { error: "Expense ID required" };

	const expense = await db
		.select()
		.from(expensesTable)
		.where(eq(expensesTable.id, expenseId));

	const participants = await db
		.select()
		.from(expenseParticipantsTable)
		.where(eq(expenseParticipantsTable.expenseId, expenseId));

	return {
		expense: expense[0],
		participants,
	};
});
