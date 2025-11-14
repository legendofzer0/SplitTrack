// /server/api/avatar/[...path].ts
import { createReadStream, existsSync } from "fs";
import { join } from "path";

export default defineEventHandler(async (event) => {
	const pathParam = event.context.params?.path;

	const filePath = Array.isArray(pathParam)
		? join(process.cwd(), "server/files/userAvatar/", ...pathParam)
		: join(process.cwd(), "server/files/userAvatar/", pathParam || "");
	if (!existsSync(filePath)) {
		throw createError({
			statusCode: 404,
			statusMessage: "File not found",
		});
	}

	setHeader(event, "Content-Type", "image/jpeg");
	return sendStream(event, createReadStream(filePath));
});
