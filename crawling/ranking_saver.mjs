import fs from "fs";
import { join } from "path";
import { parseCSV } from "./csv_parser.mjs";

async function saveRankingAsJSON() {
    // CSV 파일 경로
    const csvFilePath = join(process.cwd(), "/crawling/boardgames_ranks.csv");
    const jsonFilePath = join(process.cwd(), "/crawling/rankings.json"); // JSON 저장 경로
    try {
        const ids = await parseCSV(csvFilePath); // CSV에서 ID 추출
        const rankingData = ids.map((id, index) => ({
            ranking: index + 1, // 랭킹 추가
            id: Number(id), // ID 추가
        }));
        console.log(rankingData);
        fs.writeFileSync(jsonFilePath, JSON.stringify(rankingData, null, 2), "utf-8");

        console.log(`랭킹 데이터가 JSON 파일로 저장되었습니다: ${jsonFilePath}`);
    } catch (error) {
        console.error(`오류 발생: ${error.message}`);
    }
}

saveRankingAsJSON();
