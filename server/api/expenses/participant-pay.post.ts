import { and, eq, sql } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable, expenseParticipantsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const bodyData = await readBody<BodyStructure>(event);
		const userId = event.context.user.id;

		const budget = JSON.parse(JSON.stringify(bodyData.budget));

		await db
			.update(expenseParticipantsTable)
			.set({
				amountPaid: bodyData.amount,
				status: "paid",
			})
			.where(
				and(
					eq(expenseParticipantsTable.expenseId, bodyData.expenseId),
					eq(expenseParticipantsTable.userId, userId)
				)
			);

		await db
			.update(budgetsTable)
			.set({
				remainingAmount: sql`${budgetsTable.remainingAmount} - ${bodyData.amount}`,
			})
			.where(eq(budgetsTable.id, budget.id));

		return {
			success: true,
			message: "Paid successfully and budget updated",
		};
	} catch (error) {
		console.error("Payment Error:", error);
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error: " + error,
		});
	}
});

interface BodyStructure {
	budget: {
		id: string;
		userId: string;
		title: string;
		totalAmount: string;
		remainingAmount: string;
		currency: string;
		createdAt: string;
	};
	expenseId: string;
	amount: string;
}
