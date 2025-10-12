export default defineEventHandler(async () => {
	const pass = await generateHashedPassword("test");
	const test = await comparePassword("test", pass);

	return { isMatch: test };
});
