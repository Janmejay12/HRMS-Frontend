import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";
import { toast } from "sonner";
import {
  travelApis,
  type PageResponse,
  type travelResponse,
} from "../../apis/travelApis";
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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 8;

  const role = getUserRole();

  useEffect(() => {
    fetchTravels();
  }, [role, page]);

  const fetchTravels = async () => {
    try {
      if (role === "HR") {
        const response: PageResponse<travelResponse> =
          await travelApis.getAllTravels(page, size);
        setTravelData(response.content);
        setTotalPages(response.totalPages);
      } else {
        const response: PageResponse<travelResponse> =
          await travelApis.getMyTravels(page, size);
        setTravelData(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      setError("Failed to fetch travel data");
      toast.error("Failed to fetch travel data");
    } finally {
      setLoading(false);
    }
  };
  const filteredTravels = useMemo(() => {
    return travelData?.filter((travel) =>
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
              className="px-4 py-2 bg-gray-300 text-gray rounded-md hover:bg-gray-400 inline-flex items-center gap-2 "
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

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TravelHome;
