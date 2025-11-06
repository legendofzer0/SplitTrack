interface ExpensesByUserItem {
	id: string;
	budgetId: string | null;
	creatorId: string;
	amount: string;
	title: string;
	description: string;
	date: string;
	splitType: string;
	createdAt: string;
}

interface ExpenseParticipant {
	id: string;
	expenseId: string;
	userId: string;
	amountOwed: string;
	amountPaid: string;
	status: string;
}

interface ExpenseWithParticipant {
	expense_participants: ExpenseParticipant;
	expenses: {
		id: string;
		budgetId: string | null;
		creatorId: string;
		amount: string;
		title: string;
		description: string;
		date: string;
		splitType: string;
		createdAt: string;
	};
}

export interface ExpensesApiResponse {
	ExpensesByUser: ExpensesByUserItem[];
	ExpensesForUser: ExpenseWithParticipant[];
}
