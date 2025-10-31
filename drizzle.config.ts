import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./server/db/drizzle/migrations",
	schema: "./server/db/schemas.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
	verbose: true,
	strict: true,
});
