import { join } from "path";
import { callAPI } from "./api_crawler.mjs";

async function main() {
    const csvFilePath = join(process.cwd(), "/crawling/boardgames_ranks.csv");
    try {
        const idLength = 1000; // 최대 상위 N개
        const ids = await parseCSV(csvFilePath, idLength); // CSV에서 ID 추출
        await callAPI(ids); // API 호출 및 XML 저장
        console.log("작업 완료!");
    } catch (error) {
        console.error(`오류 발생: ${error.message}`);
    }
}

main();
