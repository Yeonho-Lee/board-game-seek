import { XMLParser } from "fast-xml-parser";

/**
 * @param {string} xmlData - XML data from API response
 * @returns {BoardGame} - Parsed board game data // types/BoardGame.d.ts
 */
// API 호출 함수 (id 리스트를 받아서 호출)
export default function parseBoardGameData(xmlData) {
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
