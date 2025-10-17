export default defineEventHandler(async (event) => {
	const token = await getHeader(event, "Authorization");
});
