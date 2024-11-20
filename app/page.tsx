import BoardgameRankings from "@/components/boardgame/boardgame-rankings";

export default function BoardgameRankingsPage() {
	return (
		<div className="container mx-auto py-10">
			<h1 className="mb-6 text-3xl font-bold">Boardgame Rankings</h1>
			<BoardgameRankings />
		</div>
	);
}
