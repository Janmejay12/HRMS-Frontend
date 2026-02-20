import React from "react";
import type { GameResponse } from "../../apis/GameApis";
import { useNavigate } from "react-router-dom";

const GameCard: React.FC<{ game: GameResponse }> = ({ game }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => navigate(`/book/${game.gameId}`)}
    >
      <img
        src={game.imageUrl}
        alt={game.name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-xl font-bold mt-3 text-gray-800">{game.gameName}</h2>
      <p className="text-gray-600 text-sm">Available from {game.operatingStartHours} to {game.operatingEndHours}</p>
    </div>
  );
};

export default GameCard;
