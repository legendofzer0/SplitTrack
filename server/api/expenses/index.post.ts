import { eq, sql } from "drizzle-orm";
import { db } from "~~/server/db";
import {
	budgetsTable,
	expenseParticipantsTable,
	expensesTable,
} from "~~/server/db/schemas";

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
			.returning();

		const expenseId = insertIntroExpenseTable[0].id;
		var insertIntoExpenseParticipants;
		if (data.split_type !== SplitType.NONE) {
			if (data.split_data) {
				for (const [key, value] of Object.entries(data.split_data)) {
					const [expPar] = await db
						.insert(expenseParticipantsTable)
						.values({
							expenseId,
							userId: key,
							amountOwed: value.toString(),
						})
						.returning({ id: expenseParticipantsTable.id });

					if (key === userId) {
						await db
							.update(budgetsTable)
							.set({
								remainingAmount: sql`${budgetsTable.remainingAmount} - ${value}`,
							})
							.where(eq(budgetsTable.id, data.budget_id));

						await db
							.update(expenseParticipantsTable)
							.set({
								amountPaid: value.toString(),
								status: "paid",
							})
							.where(eq(expenseParticipantsTable.id, expPar.id));
					}
				}
			}
		} else {
			const [expPar] = await db
				.insert(expenseParticipantsTable)
				.values({
					expenseId,
					userId,
					amountOwed: data.amount.toString(),
				})
				.returning({ id: expenseParticipantsTable.id });

			await db
				.update(budgetsTable)
				.set({
					remainingAmount: sql`${budgetsTable.remainingAmount} - ${data.amount}`,
				})
				.where(eq(budgetsTable.id, data.budget_id));

			await db
				.update(expenseParticipantsTable)
				.set({
					amountPaid: data.amount.toString(),
					status: "paid",
				})
				.where(eq(expenseParticipantsTable.id, expPar.id));
		}

		setResponseStatus(event, 200, "Expense created successfully");
		return {
			message: "Expense created successfully",
			insertIntroExpenseTable,
			insertIntoExpenseParticipants,
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
