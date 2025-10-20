export default defineEventHandler(async (event) => {
	const token = getHeader(event, "Authorization");
	if (token) {
		const isValid = await verifyToken(token);
		if (isValid) {
			return {
				isValid: true,
			};
		}
		return {
			isValid: true,
		};
	}
});
