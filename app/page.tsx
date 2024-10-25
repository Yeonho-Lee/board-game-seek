import BoardgameRankings from "@/components/boardgame/boardgame-rankings";

export default function BoardgameRankingsPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Boardgame Rankings</h1>
            <BoardgameRankings />
        </div>
    );
}
