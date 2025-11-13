import { defineEventHandler, getHeader, setResponseStatus } from "h3";
import { verifyToken } from "../utils/JWT_Utility";
import { error } from "console";

export default defineEventHandler(async (event) => {
	const allowedURIs = [
		"/",
		"/api/auth/login",
		"/api/auth/register",
		"/api/auth/verify-token",
		"/api/auth/verify-token",
	];
	const path = event.path;
	if (!path.startsWith("/api")) {
		return;
	}
	if (path.startsWith("/api/files")) return;
	if (path.startsWith("/api/avatar")) return;

	if (allowedURIs.includes(path)) {
		return;
	}

	const authToken = getHeader(event, "Authorization") || "";

	if (!authToken) {
		setResponseStatus(event, 403, "Authorized users only");
		return { error: "Authorized users only" };
	}

	try {
		const decoded = verifyToken(authToken.replace("Bearer ", ""));
		if (decoded) {
			event.context.user = decoded;
		}
	} catch (err) {
		setResponseStatus(event, 401, "Invalid or expired token");
		return { error: "Invalid or expired token" };
	}
});
