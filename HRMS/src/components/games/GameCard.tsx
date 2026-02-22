import React from "react";
import type { GameResponse } from "../../apis/GameApis";
import { useNavigate } from "react-router-dom";
import chessImg from "../../assets/images/chess.jpg";
import poolImg from "../../assets/images/pool.jpg";
import foosballImg from "../../assets/images/foosball.jpg";
const gameImages: Record<string, string> = {
  chess: chessImg,
  pool: poolImg,
  foosball: foosballImg,
};

const GameCard: React.FC<{ game: GameResponse }> = ({ game }) => {
  const navigate = useNavigate();
  const imageSrc = gameImages[game.gameName.toLowerCase()] || chessImg;
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => navigate(`/games/${game.gameId}`)}
    >
      <img
        src={imageSrc}
        alt={game.gameName}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-xl font-bold mt-3 text-gray-800">{game.gameName}</h2>
      <p className="text-gray-600 text-sm">
        Available from {game.operatingStartHours} to {game.operatingEndHours}
      </p>
    </div>
  );
};

export default GameCard;
