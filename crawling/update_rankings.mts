import { eq } from "drizzle-orm"; // 필요한 메서드 import
import { readFileSync } from "node:fs";
import { db } from "../drizzle/.client.ts";
import { games } from "../drizzle/schema.ts";

// 랭킹 데이터 읽기
const rankingData = JSON.parse(
	readFileSync(import.meta.dirname + "/rankings.json", "utf-8"),
) as { ranking: number; id: number }[];

// 랭킹 데이터 업데이트
for (const { ranking, id } of rankingData) {
	await db
		.update(games)
		.set({ rank: ranking }) // rank를 새로운 값으로 설정
		.where(eq(games.originalId, id)); // originalId 기준으로 매칭
}

console.log("Ranking update complete.");
