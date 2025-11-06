<template>
	<div class="card p-3 bg-gray-900 rounded-lg">
		<highchart :options="dailyExpenseOptions" />
	</div>
</template>
<script setup lang="ts">
	import { type ExpensesApiResponse } from "~/types/expense";
	import { computed } from "vue";
	import type { Options, TooltipFormatterContextObject } from "highcharts";

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
</script>

<style scoped>
	.card {
		background: #0b1220;
		border: 1px solid #1f2937;
		color: #e5e7eb;
	}
</style>