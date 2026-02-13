import React, { useEffect, useState } from "react";
import { travelApis, type travelResponse } from "../apis/travelApis";
import TravelList from "../components/travels/TravelList";
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

const TravelHome: React.FC = () => {
  const [travelData, setTravelData] = useState<travelResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        var fetchedTravels = await travelApis.getAllTravels();
        setTravelData(fetchedTravels);
      } catch (err) {
        setError("Failed to fetch travel data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTravels();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white-900 mb-4">Your Travels:</h2>
      <Link
        to="/travel-form"
        className="text-white-300 hover:text-white transition duration-300 flex items-center space-x-2"
      >
        <Plane className="w-4 h-4" />
        <span>Create Travels</span>
      </Link>
      <TravelList travels={travelData} />
    </div>
  );
};

export default TravelHome;
