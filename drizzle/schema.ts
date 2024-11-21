import { integer, pgTable, real, serial, text } from "drizzle-orm/pg-core";

// TODO Find missing games from the leaderboard and then insert.
// Could use SQL inArray(). Am not sure if it would support 1000 entries at once.
// Maybe select the orginal-ids, put them in a JavaScript set and find missing ones?

// TODO Handle games that are no longer in the leader board.
// Before updating the ranking, reset all values to 0.

export const games = pgTable("games", {
	originalId: serial().primaryKey(),
	name: text().notNull(),
	// Should be updated often
	rank: integer().notNull().default(0),
	// Should be updated irregularly
	weight: real().notNull(),
	rating: real().notNull(),
	minRecommendedPlayers: integer().notNull(),
	maxRecommendedPlayers: integer().notNull(),
	minBestPlayers: integer().notNull(),
	maxBestPlayers: integer().notNull(),
	//
	publishedYear: integer().notNull(),
	minPlayer: integer().notNull(),
	maxPlayer: integer().notNull(),
	age: integer().notNull(),
	minPlayingTime: integer().notNull(),
	maxPlayingTime: integer().notNull(),
	description: text().notNull(),
});
