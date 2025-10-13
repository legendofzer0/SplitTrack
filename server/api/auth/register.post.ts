import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schemas";
import emailPattern from "~~/server/const/EMAIL_REGEX";
import PASSWORD_REGEX from "~~/server/const/PASSWORD_REGEX";

export default defineEventHandler(async (event) => {
	const data: RegisterData = await readBody(event);

	try {
		if (
			!data ||
			!data.email ||
			!data.name ||
			!data.password ||
			!data.phone_number
		) {
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
		const hashedPassword = await generateHashedPassword(data.password);

		await db.insert(usersTable).values({
			name: data.name,
			email: data.email,
			password: hashedPassword,
			phone_number: data.phone_number,
		});

		setResponseStatus(event, 200, "User registered successfully");
		return { message: "User registered successfully" };
	} catch (error) {
		console.error(error);
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to register user",
		});
	}
});

type RegisterData = {
	email: string;
	password: string;
	name: string;
	phone_number: string;
};
