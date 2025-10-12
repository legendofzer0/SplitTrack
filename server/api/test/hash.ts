export default defineEventHandler(async () => {
	const pass = await generateHashedPassword("test");
	return { password: pass };
});
