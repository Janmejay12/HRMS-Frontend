import React, { useEffect, useState } from "react";
import { travelApis, type travelResponse } from "../apis/travelApis";
import TravelList from "../components/travels/TravelList";
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";
import { getUserRole } from "../utils/auth";
import TravelDetailModal from "./TravelDetailModal";

const TravelHome: React.FC = () => {
  const [travelData, setTravelData] = useState<travelResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTravel, setSelectedTravel] = useState<travelResponse | null>(
    null,
  );

  const role = getUserRole();

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        if (role === "HR") {
          await travelApis.getAllTravels().then(setTravelData);
        } else {
          await travelApis.getMyTravels().then(setTravelData);
        }
      } catch (err) {
        setError("Failed to fetch travel data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTravels();
  }, [role]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white-900 mb-4">Your Travels:</h2>
      {role == "HR" && (
        <Link
          to="/travel-form"
          className="text-white-300 hover:text-white transition duration-300 flex items-center space-x-2"
        >
          <Plane className="w-4 h-4" />
          <span>Create Travels</span>
        </Link>
      )}
      <TravelList
        travels={travelData}
        onSelect={(travel) => setSelectedTravel(travel)}
      />
      {selectedTravel && (
        <TravelDetailModal
          travel={selectedTravel}
          onClose={() => setSelectedTravel(null)}
        />
      )}
    </div>
  );
};

export default TravelHome;
