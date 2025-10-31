import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const data: budgetForm = await readBody(event);

		const createBudget = await db
			.insert(budgetsTable)
			.values({
				userId: userId,
				title: data.title,
				totalAmount: data.totalAmount.toString(),
				currency: data.currency,
				remainingAmount: data.remainingAmount.toString(),
			})
			.returning();
		setResponseStatus(event, 200, "Budget Created");
		return {
			message: "Budget Created",
			createdBudget: createBudget,
		};
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error: " + error,
		});
	}
});

type budgetForm = {
	title: string;
	totalAmount: number;
	remainingAmount: number;
	currency?: string;
};
