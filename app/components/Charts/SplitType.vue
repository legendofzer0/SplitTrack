<template>
	<div class="card p-3 bg-gray-900 rounded-lg">
		<highchart :options="splitTypeOptions" />
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import type { Options } from "highcharts";
	import { toNum } from "#imports";

	import { type ExpensesApiResponse } from "~/types/expense";

	const token = useCookie("token");
	const expenseResponse = await $fetch<ExpensesApiResponse>("/api/expenses", {
		headers: {
			Authorization: token.value ? `Bearer ${token.value}` : "",
		},
	});

	const splitTypeDistribution = computed(() => {
		const totals = new Map<string, number>();
		for (const e of expenseResponse.ExpensesByUser ?? []) {
			const key = e.splitType || "none";
			totals.set(key, (totals.get(key) || 0) + toNum(e.amount));
		}
		return Array.from(totals.entries()).map(([name, y]) => ({ name, y }));
	});

	const splitTypeOptions = computed<Options>(() => ({
		chart: {
			type: "pie",
			backgroundColor: "#0f1720",
			style: { color: "#f5f5f5" },
		},
		title: { text: "Split Type Distribution", style: { color: "#fff" } },

		legend: { itemStyle: { color: "#f5f5f5" } },
		tooltip: {
			backgroundColor: "#0f1720",
			style: { color: "#f5f5f5" },
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
</script>
<style scoped>
	.card {
		background: #0b1220;
		border: 1px solid #1f2937;
		color: #e5e7eb;
	}
</style>
