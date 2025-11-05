import { storeFileLocally } from "#imports";

export async function uploadReceipt(
	form: { name: string; filename?: string; data: string; type?: string }[]
) {
	if (!form || form.length === 0) {
		throw createError({
			statusCode: 400,
			statusMessage: "No files uploaded",
		});
	}

	const storedFiles: string[] = [];

	for (const field of form) {
		if (!field.filename) continue;

		const filename = await storeFileLocally(
			{
				name: field.filename,
				data: field.data,
				type: field.type || "",
			},
			8,
			"/receipts"
		);

		storedFiles.push(filename);
	}

	return {
		files: storedFiles,
	};
}
