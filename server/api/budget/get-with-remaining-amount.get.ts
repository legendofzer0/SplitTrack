import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const query = getQuery(event);
		const amount = query.amount || 0;
		const getBudgets = await db
			.select()
			.from(budgetsTable)
			.where(
				and(
					eq(budgetsTable.userId, userId),
					gte(
						sql`CAST(${budgetsTable.remainingAmount} AS DOUBLE PRECISION)`,
						amount
					)
				)
			);

		if (getBudgets.length !== 0) {
			setResponseStatus(event, 200, "Budget found");
			return {
				data: getBudgets,
			};
		} else {
			setResponseStatus(event, 404, "Budget not found");
			return {
				message: "Budget not found",
			};
		}
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error: " + error,
		});
	}
});
