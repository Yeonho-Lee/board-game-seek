CREATE TABLE IF NOT EXISTS "games" (
	"original_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"rank" integer DEFAULT 0 NOT NULL,
	"weight" real NOT NULL,
	"min_recommended_players" integer NOT NULL,
	"max_recommended_players" integer NOT NULL,
	"min_best_players" integer NOT NULL,
	"max_best_players" integer NOT NULL,
	"published_year" integer NOT NULL,
	"rating" real NOT NULL,
	"min_player" integer NOT NULL,
	"max_player" integer NOT NULL,
	"age" integer NOT NULL,
	"min_playing_time" integer NOT NULL,
	"max_playing_time" integer NOT NULL,
	"description" text NOT NULL
);
