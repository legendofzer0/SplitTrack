import { pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 225 }).notNull(),
		email: varchar("email", { length: 225 }).notNull(),
		password: varchar("password", { length: 225 }).notNull(),
		phone_number: varchar("phone_number", { length: 10 }).notNull(),
	},
	(table) => {
		return {
			emailIndex: uniqueIndex("emailIndex").on(table.email),
		};
	}
);
