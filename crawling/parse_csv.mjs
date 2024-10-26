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
            .on("error", (error) => {
                console.error("Error reading CSV file:", error);
                reject(error);
            });
    });
}

// API 호출 함수 (id 리스트를 받아서 호출)
async function callAPI(ids) {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    for (const id of ids) {
        try {
            const response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`);

            // HTTP 상태 코드가 정상(200)이 아닌 경우 에러를 throw
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const xmlData = response.data;

            // XML 데이터를 JSON으로 변환
            const jsonData = parser.parse(xmlData);

            const item = jsonData.items.item;

            const { bestWith, recommendedWith } = getPollSummary(item);
            const { minPlayers: minBestPlayer, maxPlayers: maxBestPlayer } = parsePlayerRange(bestWith);
            const { minPlayers: minRecommendedPlayer, maxPlayers: maxRecommendedPlayer } =
                parsePlayerRange(recommendedWith);
            const name = Array.isArray(item.name)
                ? item.name.find((n) => n.type === "primary")?.value
                : item.name?.value;
            const rank = Array.isArray(item.statistics.ratings.ranks.rank)
                ? item.statistics.ratings.ranks.rank.find((n) => n.type === "subtype")?.value
                : item.name?.value;

            // 필요한 데이터만 추출
            const boardGameInfo = {
                originalId: Number(item.id), // Convert id to a number if applicable
                name: name,
                rank: Number(rank), // Convert rank to a number
                publishedYear: Number(item.yearpublished?.value), // Convert published year
                rating: Number(item.statistics.ratings.average?.value), // Convert rating to a number
                minPlayer: Number(item.minplayers?.value), // Convert min players to a number
                maxPlayer: Number(item.maxplayers?.value), // Convert max players to a number
                minRecommendedPlayers: Number(minRecommendedPlayer) || null, // Convert min recommended players
                maxRecommendedPlayers: Number(maxRecommendedPlayer) || null, // Convert max recommended players
                minBestPlayers: Number(minBestPlayer) || null, // Convert min best players
                maxBestPlayers: Number(maxBestPlayer) || null, // Convert max best players
                age: Number(item.minage?.value), // Convert age to a number
                minPlayingTime: Number(item.minplaytime?.value), // Convert min playing time
                maxPlayingTime: Number(item.maxplaytime?.value), // Convert max playing time
                weight: Number(item.statistics.ratings.averageweight?.value), // Convert weight to a number
                description: item.description,
            };

            // 필요한 데이터만 파일로 저장
            fs.writeFileSync(`./crawling/boardgames_info/${id}.json`, JSON.stringify(boardGameInfo, null, 2), "utf-8");
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

function getPollSummary(item) {
    const pollSummary = item["poll-summary"];

    const bestWith = pollSummary?.result.find((res) => res.name === "bestwith")?.value;
    const recommendedWith = pollSummary?.result.find((res) => res.name === "recommmendedwith")?.value;

    return {
        bestWith,
        recommendedWith,
    };
}

function parsePlayerRange(playerString) {
    if (!playerString) {
        console.log("playerString is null or undefined.");
        return { minPlayers: null, maxPlayers: null };
    }

    const match = playerString.match(/(\d+)[^\d]*(\d+)?/); // 숫자 추출

    if (match) {
        const minPlayers = parseInt(match[1], 10); // 첫 번째 숫자 (min)
        const maxPlayers = match[2] ? parseInt(match[2], 10) : minPlayers; // 두 번째 숫자가 있으면 max, 없으면 min과 동일
        return { minPlayers, maxPlayers };
    }

    console.log("No match found in playerString.");
    return { minPlayers: null, maxPlayers: null }; // 일치하는 숫자가 없으면 null 반환
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
