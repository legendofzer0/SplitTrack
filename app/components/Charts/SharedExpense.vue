<template>
	<div class="card p-3 bg-gray-900 rounded-lg">
		<highchart :options="sharedStatusOptions" />
	</div>
</template>

<script setup lang="ts">
	import { type ExpensesApiResponse } from "~/types/expense";
	import { computed } from "vue";
	import type { Options } from "highcharts";

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
</script>

<style scoped>
	.card {
		background: #0b1220;
		border: 1px solid #1f2937;
		color: #e5e7eb;
	}
</style>
