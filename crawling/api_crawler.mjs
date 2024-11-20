import fs from "fs";
import fetch from "node-fetch";
import parseBoardGameData from "./boardgame_data_parser.mjs";

/**
 * @param {string} id - Board Game ID
 * @param {string} xmlData - XML response from API
 */
function saveBoardGameInfo(id, boardGameInfo) {
    const filePath = `./crawling/boardgames_info/${id}.json`;
    fs.writeFileSync(filePath, JSON.stringify(boardGameInfo, null, 2), "utf-8");
    console.log(`API 호출 및 데이터 저장 성공 (id: ${id})`);
}

/**
 * 일정 시간 대기하는 함수
 * @param {number} ms - 대기 시간 (밀리초)
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string[]} ids - Array of Board Game IDs
 */
export async function callAPI(ids) {
    for await (const id of ids) {
        try {
            const response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`);
            if (!response.ok) {
                console.error(`API 호출 실패 (id: ${id}): ${response.status} ${response.statusText}`);
                break;
            }
            const xmlData = await response.text(); // XML 데이터 가져오기
            console.log(`API 호출 성공 (id: ${id})`);
            const boardGameInfo = parseBoardGameData(xmlData); // 데이터 파싱 및 정보 추출
            console.log(`데이터 파싱 성공 (id: ${id})`);
            saveBoardGameInfo(id, boardGameInfo); // 파일로 저장
            // 요청 사이에 딜레이 추가 (ms)
            await sleep(2000);
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error(`JSON 파싱 오류 (id: ${id}): ${error.message}`);
            } else if (error.code === "ENOENT") {
                console.error(`파일 쓰기 오류 (id: ${id}): ${error.message}`);
            } else {
                console.error(`알 수 없는 오류 (id: ${id}): ${error.message}`);
            }
        }
    }
}
