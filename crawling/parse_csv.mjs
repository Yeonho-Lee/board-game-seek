import axios from "axios";
import csv from "csv-parser";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import { join } from "path";

// CSV 파일 파싱 함수 (id 컬럼만 리스트로 반환)
async function parseCSV(filePath) {
    const ids = [];
    const idLength = 10;
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                if (row.id && ids.length < idLength) {
                    // 상위 N개만 가져오기
                    ids.push(row.id);
                }
            })
            .on("end", () => resolve(ids))
            .on("error", (error) => reject(error));
    });
}

// API 호출 함수 (id 리스트를 받아서 호출)
async function callAPI(ids) {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    for (const id of ids) {
        try {
            const response = await axios.get(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`);
            const xmlData = response.data;

            // XML 데이터를 JSON으로 변환
            const jsonData = parser.parse(xmlData);

            // 필요한 데이터만 추출
            const filteredData = {
                id: Number(jsonData.items.item.id),
                name: jsonData.items.item.name[0]?.value, // 이름
                yearPublished: Number(jsonData.items.item.yearpublished.value), // 발행 연도
                minPlayers: Number(jsonData.items.item.minplayers.value), // 최소 플레이어 수
                maxPlayers: Number(jsonData.items.item.maxplayers.value), // 최대 플레이어 수
            };

            // 필요한 데이터만 파일로 저장
            fs.writeFileSync(`./crawling/boardgames_info/${id}.json`, JSON.stringify(filteredData, null, 2), "utf-8");
            console.log(`API 호출 및 데이터 저장 성공 (id: ${id})`);
        } catch (error) {
            // 에러 구분
            if (error.response) {
                // API 호출에 대한 오류
                console.error(`API 호출 실패 (id: ${id}): ${error.response.status} - ${error.response.statusText}`);
            } else if (error instanceof SyntaxError) {
                // JSON 변환 중 오류
                console.error(`JSON 파싱 오류 (id: ${id}): ${error.message}`);
            } else if (error.code === "ENOENT") {
                // 파일 쓰기 중 오류 (예: 디렉터리가 없을 경우)
                console.error(`파일 쓰기 오류 (id: ${id}):  ${error.message}`);
            } else {
                // 그 외의 오류
                console.error(`알 수 없는 오류 (id: ${id}): ${error.message}`);
            }
        }
    }
}

// XML parsing 함수들

async function parsePlayerPreferences() {
    // XML 파일 경로 설정
    const xmlFilePath = join(process.cwd(), "yourfile.xml");
    const xmlData = fs.readFileSync(xmlFilePath, "utf-8");

    // XML 파싱 설정
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
    });

    // XML 데이터 파싱
    const jsonObj = parser.parse(xmlData);

    const results = jsonObj.poll.results;

    // 초기 변수 설정
    let bestMinPlayer = Infinity;
    let bestMaxPlayer = -Infinity;
    let recMinPlayer = Infinity;
    let recMaxPlayer = -Infinity;

    // 각 인원별로 `Best` 및 `Recommended`의 최소/최대 플레이어 계산
    for (const result of results) {
        const numPlayers = result.numplayers;

        for (const entry of result.result) {
            const { value, numvotes } = entry;
            if (value === "Best" && numvotes > 0) {
                bestMinPlayer = Math.min(bestMinPlayer, parseInt(numPlayers));
                bestMaxPlayer = Math.max(bestMaxPlayer, parseInt(numPlayers));
            }
            if (value === "Recommended" && numvotes > 0) {
                recMinPlayer = Math.min(recMinPlayer, parseInt(numPlayers));
                recMaxPlayer = Math.max(recMaxPlayer, parseInt(numPlayers));
            }
        }
    }

    // 결과 출력
    console.log(`Best: Min Players = ${bestMinPlayer}, Max Players = ${bestMaxPlayer}`);
    console.log(`Recommended: Min Players = ${recMinPlayer}, Max Players = ${recMaxPlayer}`);
}

// 메인 함수
async function main() {
    const csvFilePath = join(process.cwd(), "/crawling/boardgames_ranks.csv");

    try {
        const ids = await parseCSV(csvFilePath);
        await callAPI(ids);
    } catch (error) {
        console.error(`오류 발생: ${error.message}`);
    }
}

main();
