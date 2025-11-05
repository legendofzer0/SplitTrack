<template>
	<form @submit.prevent="formSubmit">
		<BaseInput
			v-model="formData.title"
			id="Title"
			label="Title"
			:required-data="true"
			:error="errorList.title"
		/>
		<BaseInput
			v-model="formData.amount"
			id="Amount"
			label="Amount"
			type="number"
			:required-data="true"
			:error="errorList.amount"
		/>
		<BaseInput
			v-model="formData.description"
			id="Description"
			label="Description"
		/>

		<div class="mt-4">
			<label class="text-white">Budgets:</label><br />
			<select
				v-model="selectedBudget"
				class="bg-slate-800 text-white border rounded p-2 w-full"
			>
				<option value="" disabled>Select a budget</option>
				<option
					v-for="budget in budgetData"
					:key="budget.id"
					:value="budget"
				>
					{{ budget.title }}
				</option>
			</select>
			<span class="text-red-700" v-if="errorList.budget.length > 0">{{
				errorList.budget
			}}</span>
		</div>

		<div class="mt-4">
			<ExpenseUserDropDown
				:userData="users"
				:error="errorList.participants"
				@update:selected="handleUserSelect"
			/>
		</div>

		<div class="mt-4">
			<label class="text-white">Split Type:</label><br />
			<select
				v-model="formData.split_type"
				class="bg-slate-800 text-white border rounded p-2 w-full"
			>
				<option value="none">None</option>
				<option value="equal">Equal</option>
				<option value="custom">Custom</option>
			</select>
			<span class="text-red-700" v-if="!errorList.type.length > 0">{{
				errorList.type
			}}</span>
		</div>

		<div class="mt-4" v-if="formData.split_type !== 'none'">
			<label class="text-white">Split Value</label>
			<div
				v-for="(value, key) in selected"
				:key="key"
				class="flex justify-between items-center mt-2"
			>
				<div class="text-white">{{ value }}:</div>
				<BaseInput
					v-model.number="splitData[key]"
					type="number"
					:disabled="formData.split_type === 'equal'"
					class="w-32"
					:error="errorList.data"
				/>
			</div>
		</div>

		<div class="mt-4">
			<input type="checkbox" v-model="addReceipt" id="addReceipt" />
			<label for="addReceipt" class="p-2 text-white">Add Receipt</label>
		</div>

		<div v-if="addReceipt" class="mt-4">
			<label class="text-white">Upload Receipt:</label>
			<input
				type="file"
				@change="handleFileChange"
				multiple
				class="block mt-2 text-white"
			/>
		</div>

		<BaseButton type="submit" class="mt-4">Submit</BaseButton>
	</form>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from "vue";
	import { useExpenseStore } from "~/store/useExpenseStore";

	const addReceipt = ref(false);
	const receiptFiles = ref<File[]>([]);

	interface UserType {
		id: string;
		avatar: string;
		name: string;
	}

	interface creatorDataStructure {
		isValid: boolean;
		data: {
			id: string;
			iat: number;
			exp: number;
		};
	}

	const formData = reactive({
		budget_id: "",
		creator_id: "",
		amount: 0.0,
		title: "",
		description: "",
		date: "",
		split_type: "none",
		split_data: {},
		addFile: false,
		file: [] as any[],
	});

	const budgetData = ref<{ id: string; title: string }[]>([]);
	const users = ref<UserType[]>([]);
	const selected = ref<Record<string, string>>({});
	const selectedBudget = ref();
	const splitData = ref<Record<string, number>>({});
	const token = useCookie("token");
	const emit = defineEmits(["submitted:expense"]);

	onMounted(async () => {
		try {
			const userRes = await $fetch("/api/friend/get-friends", {
				method: "GET",
				query: { status: "accepted" },
				headers: {
					Authorization: token.value ? `Bearer ${token.value}` : "",
				},
			});
			if (userRes) {
				users.value = userRes.requests.map((u: any) => ({
					id: u.friendsTable.friendUserId,
					name: u.name,
					avatar: u.avatar,
				}));
			}

			const creatorData = await $fetch<creatorDataStructure>(
				"/api/auth/verify-token",
				{
					method: "GET",
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				}
			);

			formData.creator_id = creatorData.data.id;
			selected.value[creatorData.data.id] = "Me";
			splitData.value[creatorData.data.id] = 0;
		} catch (err) {
			console.error("Fetch error:", err);
		}
	});

	function handleUserSelect(value: Record<string, string>) {
		selected.value = {
			[formData.creator_id]: "Me",
			...value,
		};
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			receiptFiles.value = Array.from(target.files);
		}
	}

	async function getBudgetData(amount: number) {
		try {
			const budgetRes = await $fetch(
				"/api/budget/get-with-remaining-amount",
				{
					query: { amount },
					method: "GET",
					headers: {
						Authorization: token.value
							? `Bearer ${token.value}`
							: "",
					},
				}
			);
			if (budgetRes) budgetData.value = budgetRes.data;
		} catch (error) {
			budgetData.value = [];
		}
	}

	watch(
		[selected, () => formData.split_type, () => formData.amount],
		([newSelected, splitType, amount]) => {
			const keys = Object.keys(newSelected);
			if (!keys.length) return;

			if (!(formData.creator_id in splitData.value)) {
				splitData.value[formData.creator_id] = 0;
			}

			if (splitType === "equal" && amount > 0) {
				const perUser = +(amount / keys.length).toFixed(2);
				keys.forEach((k) => (splitData.value[k] = perUser));
			} else if (splitType === "custom") {
				keys.forEach((k) => {
					if (!(k in splitData.value)) splitData.value[k] = 0;
				});
			}
		},
		{ deep: true, immediate: true }
	);

	watch(
		() => formData.amount,
		async (newAmount) => {
			await getBudgetData(newAmount);
		}
	);

	const errorList = reactive({
		title: "",
		amount: "",
		budget: "",
		participants: "",
		type: "",
		data: "",
	});

	async function formSubmit() {
		errorList.title = "";
		errorList.amount = "";
		errorList.budget = "";
		errorList.type = "";
		errorList.data = "";

		formData.date = new Date().toLocaleDateString();
		formData.split_data = splitData.value;
		formData.budget_id = selectedBudget.value?.id || "";

		if (formData.title.length == 0) {
			errorList.title = "Title is required";
			return;
		}
		if (formData.amount < 10) {
			errorList.amount = "Total amount should be at least NRS.10";
			return;
		}
		if (!formData.budget_id) {
			errorList.budget = "Budget is required";
			return;
		}
		const totalSplit = Object.values(formData.split_data).reduce(
			(acc: number, val) => acc + Number(val),
			0
		);
		if (
			totalSplit !== Number(formData.amount) &&
			formData.split_type != "none"
		) {
			errorList.data =
				"Sum of all split values must equal the total amount.";
			return;
		}

		if (addReceipt.value && receiptFiles.value.length > 0) {
			const fileDataPromises = receiptFiles.value.map(async (file) => {
				const arrayBuffer = await file.arrayBuffer();
				const base64 = btoa(
					new Uint8Array(arrayBuffer).reduce(
						(data, byte) => data + String.fromCharCode(byte),
						""
					)
				);
				return {
					name: file.name,
					type: file.type,
					data: `data:${file.type};base64,${base64}`,
				};
			});
			formData.file = await Promise.all(fileDataPromises);
			formData.addFile = true;
		} else {
			formData.addFile = false;
			formData.file = [];
		}

		try {
			const toast = useToast();
			const expense = useExpenseStore();
			const isCreated = await expense.submit(formData);

			if (isCreated)
				toast.success({ message: "Expense Created Successfully" });
			else toast.error({ message: "Expense Was Not Created" });

			emit("submitted:expense");
		} catch (error) {
			console.log(error);
		}
	}
</script>
