import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateJWTToken(userId: string) {
	if (!JWT_SECRET) throw new Error("JWT_SECRET not defined in environment");

	return jwt.sign({ id: userId }, JWT_SECRET, {
		expiresIn: "7d",
	});
}

export function generateToken(userId: string, email: string) {
	if (!JWT_SECRET) throw new Error("JWT_SECRET not defined in environment");
	return jwt.sign({ id: userId, email: email }, JWT_SECRET);
}

export function verifyToken(token: string) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		console.error("Invalid token:", error);
		return null;
	}
}
