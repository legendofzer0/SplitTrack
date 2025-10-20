import { and, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const budgetId = getRouterParam(event, "id");

		const getBudgets = await db
			.select()
			.from(budgetsTable)
			.where(
				and(
					eq(budgetsTable.id, budgetId),
					eq(budgetsTable.userId, userId)
				)
			);

		if (getBudgets.length > 0) {
			setResponseStatus(event, 200, "Budget found");
			return {
				data: getBudgets[0],
			};
		} else {
			setResponseStatus(event, 404, "Budget not found");
			return {
				message: "Budget not found",
			};
		}
	} catch (error) {
		console.error("Error fetching budget:", error);
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error: " + error,
		});
	}
});
