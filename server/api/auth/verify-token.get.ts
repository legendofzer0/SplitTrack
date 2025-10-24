export default defineEventHandler(async (event) => {
	const token = getHeader(event, "Authorization");
	if (token) {
		const isValid = verifyToken(token);
		if (isValid) {
			return {
				isValid: true,
				data: isValid,
			};
		}
		return {
			isValid: false,
			data: isValid,
		};
	}
});
