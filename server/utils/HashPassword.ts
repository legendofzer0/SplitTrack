import "dotenv/config";
import bcrypt from "bcrypt";

export async function generateHashedPassword(
	plainPassword: string
): Promise<string> {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
	return hashedPassword;
}

export async function comparePassword(
	plainPassword: string,
	storedHashedPassword: string
): Promise<boolean> {
	const isMatch = await bcrypt.compare(plainPassword, storedHashedPassword);
	return isMatch;
}
