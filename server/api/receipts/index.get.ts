import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { receiptsTable } from "~~/server/db/schemas";

export default defineEventHandler(async (event) => {
	try {
		const data = getQuery(event);
		const id = data.expenseId;

		const receipt = await db
			.select()
			.from(receiptsTable)
			.where(eq(id, receiptsTable.expenseId));
		return receipt[0];
	} catch (error) {
		setResponseStatus(event, 500, "Internal Server Error");
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error " + error,
		});
	}
});
