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
function parseBoardGameData(xmlData) {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const jsonData = parser.parse(xmlData);
    const item = jsonData.items.item;

    const { bestWith, recommendedWith } = getPollSummary(item);
    const { minPlayers: minBestPlayer, maxPlayers: maxBestPlayer } = parsePlayerRange(bestWith);
    const { minPlayers: minRecommendedPlayer, maxPlayers: maxRecommendedPlayer } = parsePlayerRange(recommendedWith);
    const name = Array.isArray(item.name) ? item.name.find((n) => n.type === "primary")?.value : item.name?.value;
    const rank = Array.isArray(item.statistics.ratings.ranks.rank)
        ? item.statistics.ratings.ranks.rank.find((n) => n.type === "subtype")?.value
        : item.name?.value;

    return {
        originalId: Number(item.id),
        name: name,
        rank: Number(rank),
        publishedYear: Number(item.yearpublished?.value),
        rating: Number(item.statistics.ratings.average?.value),
        minPlayer: Number(item.minplayers?.value),
        maxPlayer: Number(item.maxplayers?.value),
        minRecommendedPlayers: Number(minRecommendedPlayer) || null,
        maxRecommendedPlayers: Number(maxRecommendedPlayer) || null,
        minBestPlayers: Number(minBestPlayer) || null,
        maxBestPlayers: Number(maxBestPlayer) || null,
        age: Number(item.minage?.value),
        minPlayingTime: Number(item.minplaytime?.value),
        maxPlayingTime: Number(item.maxplaytime?.value),
        weight: Number(item.statistics.ratings.averageweight?.value),
        description: item.description,
    };
}

function saveBoardGameInfo(id, boardGameInfo) {
    const filePath = `./crawling/boardgames_info/${id}.json`;
    fs.writeFileSync(filePath, JSON.stringify(boardGameInfo, null, 2), "utf-8");
    console.log(`API 호출 및 데이터 저장 성공 (id: ${id})`);
}

async function callAPI(ids) {
    for await (const id of ids) {
        try {
            const response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`);
            if (!response.ok) {
                console.error(`API 호출 실패 (id: ${id}): ${response.status} ${response.statusText}`);
                break;
            }
            const xmlData = await response.text(); // XML 데이터 가져오기
            const boardGameInfo = parseBoardGameData(xmlData); // 데이터 파싱 및 정보 추출
            saveBoardGameInfo(id, boardGameInfo); // 파일로 저장
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
