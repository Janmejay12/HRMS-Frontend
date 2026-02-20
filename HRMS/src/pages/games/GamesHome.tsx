import React, { useEffect, useState } from "react";
import { GameApis, type GameResponse } from "../../apis/GameApis";
import GameCard from "../../components/games/GameCard";

const GamesHome = () => {
  const [games, setGames] = useState<GameResponse[]>([]);
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const data = await GameApis.getAllGames();
    setGames(data);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Available Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard key={game.gameId} game={game} />
        ))}
      </div>
    </div>
  );
};

export default GamesHome;
