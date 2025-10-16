import { db } from "~~/server/db";
import { expenseParticipantsTable, expensesTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const userId = event.context.user.id;
		const data: ExpensePost = await readBody(event);
		const rawDate = data.date;
		
		let dateString;

		if (rawDate) {
			const dateObject = new Date(rawDate);
			dateString = dateObject.toISOString();
		} else {
			dateString = undefined;
		}
		const expenseToInsert = {
			budgetId: data.budget_id,
			creatorId: data.creator_id,
			amount: data.amount.toString(),
			title: data.title,
			description: data.description,
			date: dateString,
			splitType: data.split_type,
		};
		const insertIntroExpenseTable = await db
			.insert(expensesTable)
			.values(expenseToInsert)
			.returning({ id: expensesTable.id });

		const expenseId = insertIntroExpenseTable[0].id;

		if (data.split_type != SplitType.NONE) {
			if (data.split_data) {
				for (const [key, value] of Object.entries(data.split_data)) {
					const insertIntoExpenseParticipants = await db
						.insert(expenseParticipantsTable)
						.values({
							expenseId: expenseId,
							userId: key,
							amountOwed: value.toString(),
						});
				}
			}
		}
		setResponseStatus(event, 200, "Expense created successfully");
		return {
			message: "Expense created successfully",
		};
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});

type ExpensePost = {
	budget_id: string;
	creator_id: string;
	amount: number;
	title: string;
	description?: string;
	date?: Date;
	split_type: SplitType;
	split_data?: Record<string, number>;
};

enum SplitType {
	EQUAL = "equal",
	CUSTOM = "custom",
	PERCENTAGE = "percentage",
	NONE = "none",
}
