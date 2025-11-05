<template>
	<div class="p-4">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="card p-3 bg-gray-900 rounded-lg">
				<highchart :options="dailyExpenseOptions" />
			</div>

			<div class="card p-3 bg-gray-900 rounded-lg">
				<highchart :options="splitTypeOptions" />
			</div>

			<div class="card p-3 bg-gray-900 rounded-lg">
				<highchart :options="sharedStatusOptions" />
			</div>

			<div class="card p-3 bg-gray-900 rounded-lg md:col-span-2">
				<highchart :options="cumulativeOptions" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import type { Options, TooltipFormatterContextObject } from "highcharts";

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

	interface ExpensesApiResponse {
		ExpensesByUser: ExpensesByUserItem[];
		ExpensesForUser: ExpenseWithParticipant[];
	}

	const token = useCookie("token");
	const expenseResponse = await $fetch<ExpensesApiResponse>("/api/expenses", {
		headers: {
			Authorization: token.value ? `Bearer ${token.value}` : "",
		},
	});

	function toNum(n: string | number | undefined): number {
		if (n === undefined || n === null) return 0;
		const parsed = typeof n === "number" ? n : parseFloat(String(n));
		return Number.isFinite(parsed) ? parsed : 0;
	}

	const dailyTotals = computed(() => {
		const map = new Map<string, number>();
		for (const e of expenseResponse.ExpensesByUser ?? []) {
			const date = e.date || e.createdAt?.slice(0, 10) || "unknown";
			const amount = toNum(e.amount);
			map.set(date, (map.get(date) || 0) + amount);
		}
		return Array.from(map.entries())
			.map(([date, total]) => ({ date, total }))
			.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	});

	const splitTypeDistribution = computed(() => {
		const totals = new Map<string, number>();
		for (const e of expenseResponse.ExpensesByUser ?? []) {
			const key = e.splitType || "none";
			totals.set(key, (totals.get(key) || 0) + toNum(e.amount));
		}
		return Array.from(totals.entries()).map(([name, y]) => ({ name, y }));
	});

	const sharedStatus = computed(() => {
		let pending = 0;
		let paid = 0;
		for (const rec of expenseResponse.ExpensesForUser ?? []) {
			const p = rec.expense_participants;
			pending += toNum(p.amountOwed) - toNum(p.amountPaid);
			paid += toNum(p.amountPaid);
		}
		if (pending < 0) pending = 0;
		return [
			{ name: "Pending", y: pending },
			{ name: "Paid", y: paid },
		];
	});

	const cumulativeSeries = computed(() => {
		const points = dailyTotals.value.map((d) => ({
			date: d.date,
			total: d.total,
		}));
		let running = 0;
		return points.map((p) => {
			running += p.total;
			return { x: new Date(p.date).getTime(), y: running, date: p.date };
		});
	});

	const dailyExpenseOptions = computed<Options>(() => ({
		chart: {
			type: "column",
			backgroundColor: "#0f1720",
			style: { color: "#f5f5f5" },
		},
		title: { text: "Daily Spending", style: { color: "#fff" } },
		xAxis: {
			categories: dailyTotals.value.map((d) => d.date),
			labels: { style: { color: "#f5f5f5" } },
			lineColor: "#475569",
			tickColor: "#475569",
		},
		yAxis: {
			min: 0,
			title: { text: "Amount (NRP)", style: { color: "#ccc" } },
			labels: { style: { color: "#ccc" } },
		},
		tooltip: {
			formatter(this: TooltipFormatterContextObject) {
				return `<b>${this.key}</b><br/>Spent: ${this.y}`;
			},
			backgroundColor: "#171717",
			style: { color: "#ccc" },
		},
		legend: {
			itemStyle: { color: "#f5f5f5" },
			itemHoverStyle: { color: "#ffd6d6" },
		},
		series: [
			{
				type: "column",
				name: "Spent",
				data: dailyTotals.value.map((d) => d.total),
				color: "#f97316",
			},
		],
	}));

	const splitTypeOptions = computed<Options>(() => ({
		chart: {
			type: "pie",
			backgroundColor: "#0f1720",
			style: { color: "#f5f5f5" },
		},
		title: { text: "Split Type Distribution", style: { color: "#fff" } },

		legend: { itemStyle: { color: "#f5f5f5" } },
		tooltip: {
			pointFormat:
				"{series.name}: <b>{point.y}</b><br/>Percent: <b>{point.percentage:.1f}%</b>",
		},
		plotOptions: {
			pie: {
				innerSize: "40%",
				dataLabels: {
					enabled: true,
					format: "{point.name}: {point.y}",
				},
			},
		},
		series: [
			{
				type: "pie",
				name: "Amount",
				data: splitTypeDistribution.value.length
					? splitTypeDistribution.value
					: [{ name: "No data", y: 1 }],
			},
		],
	}));

	const sharedStatusOptions = computed<Options>(() => ({
		chart: {
			type: "pie",
			backgroundColor: "#0f1720",
			style: { color: "#f5f5f5" },
		},
		title: { text: "Shared Expense Status", style: { color: "#fff" } },
		plotOptions: {
			pie: {
				innerSize: "50%",
				dataLabels: {
					enabled: true,
					format: "{point.name}: {point.y}",
				},
			},
		},

		legend: { itemStyle: { color: "#f5f5f5" } },
		series: [{ type: "pie", name: "Amount", data: sharedStatus.value }],
	}));

	const cumulativeOptions = computed<Options>(() => ({
		chart: {
			type: "line",
			zoomType: "x",
			backgroundColor: "#0f1720",
			style: { color: "#f5f5f5" },
		},
		title: { text: "Cumulative Spending", style: { color: "#fff" } },

		legend: {
			itemStyle: { color: "#f5f5f5" },
			itemHoverStyle: { color: "#ffd6d6" },
		},
		xAxis: {
			type: "datetime",
			labels: { style: { color: "#f5f5f5" } },
			lineColor: "#475569",
			tickColor: "#475569",
		},
		yAxis: {
			title: { text: "Cumulative Amount", style: { color: "#ccc" } },
			labels: { style: { color: "#ccc" } },
		},
		tooltip: {
			formatter(this: TooltipFormatterContextObject) {
				const date =
					(this.x &&
						new Date(Number(this.x)).toISOString().slice(0, 10)) ||
					"";
				return `<b>${date}</b><br/>Cumulative: ${this.y}`;
			},
		},
		series: [
			{
				type: "line",
				name: "Cumulative",
				data: cumulativeSeries.value.map((p) => [p.x, p.y]),
				marker: { enabled: true },
			},
		],
	}));
</script>

<style scoped>
	.card {
		background: #0b1220;
		border: 1px solid #1f2937;
		color: #e5e7eb;
	}
</style>
