import { desc, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const getBudgets = await db
			.select()
			.from(budgetsTable)
			.where(eq(budgetsTable.userId, userId))
			.orderBy(desc(budgetsTable.createdAt));
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
