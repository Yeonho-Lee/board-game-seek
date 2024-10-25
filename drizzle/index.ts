import { eq } from 'drizzle-orm';
import { db } from './client.ts';
import { userTable } from './schema.ts';

(async () => {
	await db.insert(userTable).values([
		{
			name: 'Hyunbin',
			age: 20,
			email: 'hyunbinseo@example.com',
		},
		{
			name: 'Yeonho',
			age: 21,
			email: 'yeonholee@example.com',
		},
	]);

	const existingUser = await db.query.userTable.findFirst();
	console.log(existingUser);

	const nonExistingUser = await db.query.userTable.findFirst({
		where: eq(userTable.name, 'Gildong'),
	});
	console.log(nonExistingUser);

	const users = await db.query.userTable.findMany();
	console.log(users);
})();
