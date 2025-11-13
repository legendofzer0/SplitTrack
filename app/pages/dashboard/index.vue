<template>
	<BaseHeading>Dashboard</BaseHeading>
	<hr />
	<br />
	<UserManagementBar />
	<br />
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
		<ChartsBudget />
		<ChartsDailyExpense />
		<ChartsSplitType />
		<ChartsSharedExpense />
	</div>
	<br />
	<div class="w-full">
		<ChartsCumulativeSpending />
	</div>
</template>
