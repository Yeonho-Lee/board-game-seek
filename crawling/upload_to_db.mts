import { globSync, readFileSync } from "node:fs";
import { db } from "../drizzle/client.ts";
import { games } from "../drizzle/schema.ts";
import type { parseBoardGameData } from "./boardgame_data_parser.mjs";

type BoardGameData = ReturnType<typeof parseBoardGameData>;

const jsonFilePaths = globSync(import.meta.dirname + "/boardgames_info/*.json");

for (const path of jsonFilePaths) {
	const game = JSON.parse(readFileSync(path, "utf-8")) as BoardGameData;
	await db.insert(games).values(game);
}
