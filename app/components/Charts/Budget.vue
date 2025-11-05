<template>
	<highchart :options="options" />
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import type { Options, TooltipFormatterContextObject } from "highcharts";

	interface Budget {
		id: string;
		userId: string;
		title: string;
		totalAmount: string;
		remainingAmount: string;
		currency: string;
		createdAt: string;
	}

	interface BudgetResponse {
		data?: Budget[];
		message?: string;
	}

	const token = useCookie("token");

	const budgetResponse = await $fetch<BudgetResponse>("/api/budget", {
		headers: {
			Authorization: token.value ? `Bearer ${token.value}` : "",
		},
	});

	const budgetData = budgetResponse.data ?? [];

	const formattedData = budgetData.map((b: Budget) => ({
		title: b.title,
		totalAmount: parseFloat(b.totalAmount),
		remainingAmount: parseFloat(b.remainingAmount),
		usedAmount: parseFloat(b.totalAmount) - parseFloat(b.remainingAmount),
	}));

	const options = computed<Options>(() => ({
		chart: {
			type: "column",
			backgroundColor: "#1e1e1e",
			style: { color: "#fff" },
		},

		title: {
			text: "Budget Overview",
			align: "center",
			style: { color: "#fff" },
		},

		xAxis: {
			categories: formattedData.map((b) => b.title),
			labels: { style: { color: "#ccc" } },
			lineColor: "#555",
			tickColor: "#555",
		},

		yAxis: {
			min: 0,
			title: { text: "Amount (NRP)", style: { color: "#fff" } },
			labels: { style: { color: "#ccc" } },
			gridLineColor: "#333",
		},

		tooltip: {
			backgroundColor: "#222",
			borderColor: "#555",
			style: { color: "#fff" },
			formatter(this: TooltipFormatterContextObject) {
				return `
				<b>${this.key}</b><br/>
				${this.series.name}: ${this.y}<br/>
				Total: ${this.point.stackTotal}
			`;
			},
		},

		plotOptions: {
			column: {
				stacking: "normal",
				dataLabels: {
					enabled: true,
					color: "#fff",
				},
			},
		},

		legend: {
			itemStyle: { color: "#fff" },
			itemHoverStyle: { color: "#ffd6d6" },
		},

		series: [
			{
				name: "Used",
				type: "column",
				data: formattedData.map((b) => b.usedAmount),
				color: "#f87171",
			},
			{
				name: "Remaining",
				type: "column",
				data: formattedData.map((b) => b.remainingAmount),
				color: "#4ade80",
			},
		],
	}));
</script>
