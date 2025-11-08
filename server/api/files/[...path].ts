// /server/api/files/[...path].ts
import { createReadStream, existsSync } from "fs";
import { join } from "path";

export default defineEventHandler(async (event) => {
	console.log("reached here");

	const pathParam = event.context.params?.path;

	const filePath = Array.isArray(pathParam)
		? join(process.cwd(), "server/files", ...pathParam)
		: join(process.cwd(), "server/files", pathParam || "");
	console.log(filePath);
	if (!existsSync(filePath)) {
		throw createError({
			statusCode: 404,
			statusMessage: "File not found",
		});
	}

	setHeader(event, "Content-Type", "image/jpeg");
	return sendStream(event, createReadStream(filePath));
});
