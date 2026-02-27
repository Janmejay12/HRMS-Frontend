import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";
import { toast } from "sonner";
import { travelApis, type travelResponse } from "../../apis/travelApis";
import { getUserRole } from "../../utils/auth";
import TravelList from "../../components/travels/TravelList";
import TravelDetailModal from "./TravelDetailModal";

const TravelHome: React.FC = () => {
  const [travelData, setTravelData] = useState<travelResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTravel, setSelectedTravel] = useState<travelResponse | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const role = getUserRole();

  useEffect(() => {
    fetchTravels();
  }, [role]);

  const fetchTravels = async () => {
    try {
      if (role === "HR") {
        await travelApis.getAllTravels().then(setTravelData);
      } else {
        await travelApis.getMyTravels().then(setTravelData);
      }
    } catch (err) {
      setError("Failed to fetch travel data");
      toast.error("Failed to fetch travel data");
    } finally {
      setLoading(false);
    }
  };
  const filteredTravels = useMemo(() => {
    return travelData.filter((travel) =>
      travel.travelTitle.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [travelData, searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="relative flex items-center justify-between mb-6">
        <div className="w-1/3">
          {role === "HR" && (
            <Link
              to="/travel-form"
              className="px-4 py-2 bg-gray-600 text-gray rounded-md hover:bg-gray-700 inline-flex items-center gap-2 "
            >
              <Plane className="w-4 h-4" />
              Create Travels
            </Link>
          )}
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h2 className="text-2xl font-bold text-gray-800">Your Travels</h2>
        </div>

        <div className="w-1/3 flex justify-end">
          <input
            type="text"
            placeholder="Search travels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-600 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <TravelList
        travels={filteredTravels}
        onSelect={(travel) => setSelectedTravel(travel)}
      />
      {selectedTravel && (
        <TravelDetailModal
          travel={selectedTravel}
          onClose={() => {
            setSelectedTravel(null);
            fetchTravels();
          }}
        />
      )}
    </div>
  );
};

export default TravelHome;
