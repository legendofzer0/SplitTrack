ALTER TABLE "expense_participants" ADD CONSTRAINT "expense_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "end_date";