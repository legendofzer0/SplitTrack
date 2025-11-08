export function toNum(n: string | number | undefined): number {
	if (n === undefined || n === null) return 0;
	const parsed = typeof n === "number" ? n : parseFloat(String(n));
	return Number.isFinite(parsed) ? parsed : 0;
}
