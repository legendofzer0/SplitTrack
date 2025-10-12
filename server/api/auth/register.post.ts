import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schemas";
import bcrypt from "bcrypt";
import emailPattern from "~~/server/const/EMAIL_REGEX";
import PASSWORD_REGEX from "~~/server/const/PASSWORD_REGEX";

export default defineEventHandler(async (event) => {
	const data: RegisterData = await readBody(event);

	try {
		if (!data.email || !data.name || !data.password || !data.phone_number) {
			return { statusCode: 400, message: "All fields are required" };
		}
		if (!emailPattern.test(data.email)) {
			return { statusCode: 400, message: "email is invalid" };
		}
		if (!PASSWORD_REGEX.test(data.password)) {
			return { statusCode: 400, message: "Password is invalid" };
		}
		const hashedPassword = await generateHashedPassword(data.password);

		await db.insert(usersTable).values({
			name: data.name,
			email: data.email,
			password: hashedPassword,
			phone_number: data.phone_number,
		});

		return { statusCode: 200, message: "User registered successfully" };
	} catch (error) {
		console.error(error);
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to register user",
		});
	}
});

async function generateHashedPassword(plainPassword: string): Promise<string> {
	const saltRounds = 10;
	return await bcrypt.hash(plainPassword, saltRounds);
}

type RegisterData = {
	email: string;
	password: string;
	name: string;
	phone_number: string;
};
