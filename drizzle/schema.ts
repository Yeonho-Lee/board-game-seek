import { relations } from 'drizzle-orm';
import { char, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const userTable = pgTable('user', {
	id: char({ length: 26 }).primaryKey().$default(ulid),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
});

// db.query API 상에서 사용됨
// db.select API만 사용하고, 직접 join할 거면 정의하지 않아도 됨
// 물론 매번 직접 join 할 거면 굳이 Drizzle ORM을 쓸 필요가 없음
export const userRelations = relations(userTable, ({ many }) => ({
	logins: many(loginTable),
}));

export const loginTable = pgTable('login', {
	id: char({ length: 26 }).primaryKey().$default(ulid),
	userId: char({ length: 26 })
		.notNull()
		.references(() => userTable.id),
	userIp: varchar().notNull(),
});

export const loginRelations = relations(loginTable, ({ one }) => ({
	// many 쪽 말고 one 쪽에는 부연 설명을 달아줘야함. join할 때 어떤 값들을 참조할지
	user: one(userTable, { fields: [loginTable.userId], references: [userTable.id] }),
}));
