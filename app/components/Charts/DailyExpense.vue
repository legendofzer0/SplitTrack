<template>
	<div class="card p-3 bg-gray-900 rounded-lg">
		<highchart :options="dailyExpenseOptions" />
	</div>
</template>

<script setup lang="ts">
	import { type ExpensesApiResponse } from "~/types/expense";
	import { computed } from "vue";
	import type { Options, TooltipFormatterContextObject } from "highcharts";
	import { toNum } from "#imports";

	const token = useCookie("token");
	const expenseResponse = await $fetch<ExpensesApiResponse>("/api/expenses", {
		headers: {
			Authorization: token.value ? `Bearer ${token.value}` : "",
		},
	});

	const dailyTotals = computed(() => {
		const map = new Map<string, number>();
		const now = new Date();
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(now.getDate() - 7);

		for (const e of expenseResponse.ExpensesByUser ?? []) {
			const dateStr = e.date || e.createdAt?.slice(0, 10);
			if (!dateStr) continue;

			const date = new Date(dateStr);
			if (date >= sevenDaysAgo && date <= now) {
				const amount = toNum(e.amount);
				map.set(dateStr, (map.get(dateStr) || 0) + amount);
			}
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
		title: { text: "Last 7 Days Spending", style: { color: "#fff" } },
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
