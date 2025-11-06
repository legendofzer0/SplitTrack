<template>
	<div class="card p-3 bg-gray-900 rounded-lg md:col-span-2">
		<highchart :options="cumulativeOptions" />
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
