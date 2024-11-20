// BoardGame.ts

export interface BoardGame {
    originalId: number;
    name: string | null;
    rank: number | null;
    publishedYear: number | null;
    rating: number | null;
    minPlayer: number | null;
    maxPlayer: number | null;
    minRecommendedPlayers: number | null;
    maxRecommendedPlayers: number | null;
    minBestPlayers: number | null;
    maxBestPlayers: number | null;
    age: number | null;
    minPlayingTime: number | null;
    maxPlayingTime: number | null;
    weight: number | null;
    description: string | null;
}
