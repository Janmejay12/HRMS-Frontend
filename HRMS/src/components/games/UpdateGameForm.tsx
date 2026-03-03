import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  GameApis,
  type GameResponse,
  type UpdateGameRequest,
} from "../../apis/GameApis";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

const UpdateGameForm: React.FC = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState<UpdateGameRequest>({
    slotMinutes: 30,
    operatingEndHours: "",
    operatingStartHours: "",
  });
  const [game, setGame] = useState<GameResponse | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  

  useEffect(() => {
    GameApis.getGameById(Number(id)).then(setGame);
  }, [id]);

  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!game) return;

    setFormData({
      slotMinutes: game.slotMinutes,
      operatingStartHours: game.operatingStartHours.slice(0, 5),
      operatingEndHours: game.operatingEndHours.slice(0, 5),
    });
  }, [game]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await GameApis.updateGame(game.gameId, formData);
      toast.success("Game updated successfully");
      navigate("/games");

      setFormData({
        slotMinutes: 30,
        operatingEndHours: "",
        operatingStartHours: "",
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to update game";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md items-center text-center mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Travel</h2>
        <label>
          Slot Minutes
          <input
            name="slotMinutes"
            value={formData.slotMinutes}
            onChange={handleChange}
            placeholder="Slot Minutes"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </label>

        <label>
          Start Time
          <input
            type="time"
            name="operatingStartHours"
            value={formData.operatingStartHours}
            onChange={handleChange}
            placeholder="Start Time of Operating hours"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </label>

        <label>
          End Time
          <input
            type="time"
            name="operatingEndHours"
            value={formData.operatingEndHours}
            onChange={handleChange}
            placeholder="End Time of Operating hours"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-gray px-4 py-2 rounded"
        >
          {isLoading ? "Updating..." : "Update Game"}
        </button>
      </form>
    </div>
  );
};

export default UpdateGameForm;
