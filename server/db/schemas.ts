import { sql } from "drizzle-orm";
import {
	pgTable,
	uniqueIndex,
	uuid,
	varchar,
	date,
	text,
	timestamp,
	numeric,
	pgEnum,
} from "drizzle-orm/pg-core";

export const splitTypeEnum = pgEnum("split_type_enum", [
	"equal",
	"custom",
	"percentage",
	"none",
]);
export const usersTable = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 225 }).notNull(),
		email: varchar("email", { length: 225 }).notNull(),
		password: varchar("password", { length: 225 }).notNull(),
		phone_number: varchar("phone_number", { length: 10 }).notNull(),
		avatar: text("avatar_url").notNull().default("default_avatar.png"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => {
		return {
			emailIndex: uniqueIndex("emailIndex").on(table.email),
		};
	}
);

export const budgetsTable = pgTable("budgets", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
	currency: varchar("currency", { length: 10 }).notNull().default("NPR"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const expensesTable = pgTable("expenses", {
	id: uuid("id").primaryKey().defaultRandom(),
	budgetId: uuid("budget_id")
		.notNull()
		.references(() => budgetsTable.id, { onDelete: "cascade" }),
	creatorId: uuid("creator_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	date: date("date")
		.notNull()
		.default(sql`CURRENT_DATE`),
	splitType: splitTypeEnum("split_type").notNull().default("equal"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const expenseParticipantsTable = pgTable("expense_participants", {
	id: uuid("id").primaryKey().defaultRandom(),
	expenseId: uuid("expense_id")
		.notNull()
		.references(() => expensesTable.id, { onDelete: "cascade" }),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	amountOwed: numeric("amount_owed", { precision: 12, scale: 2 }).default(
		sql`0`
	),
	amountPaid: numeric("amount_paid", { precision: 12, scale: 2 }).default(
		sql`0`
	),
	status: varchar("status", { length: 50 }).default("pending"), // e.g., "pending", "settled"
});

export const friendsTable = pgTable("friends", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),

	friendUserId: uuid("friend_user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	token: varchar("token", { length: 255 }).notNull(),
	invitation_id: uuid("invitation_id").references(() => invitationsTable.id, {
		onDelete: "set null",
	}),
	status: varchar("status", { length: 50 }).default("pending"),
});

export const receiptsTable = pgTable("receipts", {
	id: uuid("id").primaryKey().defaultRandom(),
	expenseId: uuid("expense_id")
		.notNull()
		.references(() => expensesTable.id, { onDelete: "cascade" }),
	fileUrl: text("file_url").notNull(),
	mime: varchar("mime", { length: 100 }).notNull(),
	uploadedBy: uuid("uploaded_by").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const invitationsTable = pgTable("invitations", {
	id: uuid("id").primaryKey().defaultRandom(),
	// * user id of person who sent the request
	inviterId: uuid("inviter_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	// * email of person who receive the request
	inviteeEmail: varchar("invitee_email", { length: 255 })
		.notNull()
		.references(() => usersTable.email, { onDelete: "cascade" }),
	token: varchar("token", { length: 255 }).notNull(),
	status: varchar("status", { length: 50 }).default("pending"),
});
