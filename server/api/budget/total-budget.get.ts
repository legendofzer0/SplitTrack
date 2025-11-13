import { eq, sum } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const getTotalAmount = await db
			.select({ amount: sum(budgetsTable.remainingAmount) })
			.from(budgetsTable)
			.where(eq(budgetsTable.userId, userId));

		const totalAmount: number = parseFloat(
			getTotalAmount[0]?.amount ?? "0"
		);

		setResponseStatus(event, 200, "Found Balance");
		return { totalAmount };
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error: " + error,
		});
	}
});
