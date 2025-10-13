import emailPattern from "~~/server/const/EMAIL_REGEX";
import PASSWORD_REGEX from "~~/server/const/PASSWORD_REGEX";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schemas";
import { eq } from "drizzle-orm";
import { generateJWTToken } from "~~/server/utils/JWT_Utility";

export default defineEventHandler(async (event) => {
	const data: loginData = await readBody(event);
	try {
		if (!data || !data.email || !data.password) {
			setResponseStatus(event, 400, "All field are required");
			return { message: "All fields are required" };
		}
		if (!emailPattern.test(data.email)) {
			setResponseStatus(event, 400, "Email does not match");
			return { message: "email is invalid" };
		}
		if (!PASSWORD_REGEX.test(data.password)) {
			setResponseStatus(event, 400, "Password is not valid");
			return { message: "Password is invalid" };
		}

		const result = await db
			.select({ password: usersTable.password, id: usersTable.id })
			.from(usersTable)
			.where(eq(usersTable.email, data.email));
		if (result.length === 0) {
			setResponseStatus(event, 401, "Email or password is incorrect");
			return { message: "Email or password is incorrect" };
		}
		const hashedPassword = result[0].password;

		const isAuthenticated = await comparePassword(
			data.password,
			hashedPassword
		);

		if (isAuthenticated) {
			const token = generateJWTToken(result[0].id);
			setResponseStatus(event, 200, "Login successful");
			return { message: "Login successful", token: token };
		}
		setResponseStatus(event, 401, "Email or password is incorrect");
		return { message: "Email or password is incorrect" };
	} catch {
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to register user",
		});
	}
});

type loginData = {
	email: string;
	password: string;
};
