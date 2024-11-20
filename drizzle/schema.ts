import { integer, pgTable, real, serial, text } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
	id: serial().primaryKey(),
	originalId: integer().notNull(),
	name: text().notNull(),
	rank: integer().notNull(),
	publishedYear: integer().notNull(),
	rating: real().notNull(),
	minPlayer: integer().notNull(),
	maxPlayer: integer().notNull(),
	minRecommendedPlayers: integer().notNull(),
	maxRecommendedPlayers: integer().notNull(),
	minBestPlayers: integer().notNull(),
	maxBestPlayers: integer().notNull(),
	age: integer().notNull(),
	minPlayingTime: integer().notNull(),
	maxPlayingTime: integer().notNull(),
	weight: real().notNull(),
	description: text().notNull(),
});
