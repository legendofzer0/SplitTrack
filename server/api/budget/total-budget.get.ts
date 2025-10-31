import { eq, sum } from "drizzle-orm";
import { db } from "~~/server/db";
import {
	budgetsTable,
	expenseParticipantsTable,
	expensesTable,
} from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const getTotalAmount = await db
			.select({ amount: sum(budgetsTable.totalAmount) })
			.from(budgetsTable)
			.where(eq(budgetsTable.userId, userId));

		const getTotalExpensePaid = await db
			.select({ exp: sum(expensesTable.amount) })
			.from(expensesTable)
			.where(eq(expensesTable.creatorId, userId));

		const getTotalExpensePaidFromParticipation = await db
			.select({ exp: sum(expenseParticipantsTable.amountPaid) })
			.from(expenseParticipantsTable)
			.where(eq(expenseParticipantsTable.userId, userId));

		const totalAmount: number = parseFloat(
			getTotalAmount[0]?.amount ?? "0"
		);
		const totalExpensePaid: number = parseFloat(
			getTotalExpensePaid[0]?.exp ?? "0"
		);
		const totalExpensePaidFromParticipation: number = parseFloat(
			getTotalExpensePaidFromParticipation[0]?.exp ?? "0"
		);

		const balance: number =
			totalAmount - totalExpensePaid - totalExpensePaidFromParticipation;

		setResponseStatus(event, 200, "Found Balance");
		return { balance };
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error: " + error,
		});
	}
});
