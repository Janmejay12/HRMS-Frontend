import React, { useEffect, useState } from "react";
import { GameApis, type GameResponse } from "../../apis/GameApis";
import GameCard from "../../components/games/GameCard";
import { useNavigate } from "react-router-dom";

const GamesHome = () => {
  const [games, setGames] = useState<GameResponse[]>([]);
  const navigate = useNavigate();

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
      <button
        onClick={() => navigate("/my-bookings")}
        className="bg-blue-600 text-gray px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md"
      >
        My Bookings
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard key={game.gameId} game={game} />
        ))}
      </div>
    </div>
  );
};

export default GamesHome;
