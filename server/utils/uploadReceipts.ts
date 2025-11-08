import { ServerFile } from "nuxt-file-storage";
import { db } from "../db";
import { receiptsTable } from "../db/schemas";

export async function uploadReceipts(
	file: ServerFile,
	expense_id: string,
	user_id: string
) {
	try {
		const filename = await storeFileLocally(file, 8, "/receipt");

		if (filename) {
			const addToReceiptDb = await db.insert(receiptsTable).values({
				fileUrl: "/receipt/" + filename,
				expenseId: expense_id,
				mime: file.type,
				uploadedBy: user_id,
			});

			return addToReceiptDb;
		}
	} catch (error) {
		console.log(error);
	}
}
