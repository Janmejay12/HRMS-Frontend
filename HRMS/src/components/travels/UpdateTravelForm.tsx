import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  travelApis,
  type travelResponse,
  type updateTravelRequest,
} from "../../apis/travelApis";
import { adminApis, type EmployeeResponse } from "../../apis/AdminApis";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UpdateTravelForm: React.FC<{
  travel: travelResponse;
}> = ({ travel }) => {
  const [formData, setFormData] = useState<updateTravelRequest>({
    travelTitle: "",
    location: "",
    purpose: "",
    startDate: "",
    maxPerDayAllowance: 0,
    endDate: "",
    employeeIds: [],
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      var fetchedEmployees = await adminApis.getAllEmployees();
      setEmployees(fetchedEmployees);
      console.log(fetchedEmployees);
    };
    fetchEmployees();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxPerDayAllowance" ? parseFloat(value) : value,
    }));
  };

  const toggleEmployee = (id: number) => {
    setFormData((prev) => {
      const exists = prev.employeeIds.includes(id);
      const newIds = exists
        ? prev.employeeIds.filter((empId) => empId !== id)
        : [...prev.employeeIds, id];
      return { ...prev, employeeIds: newIds };
    });
  };

  // Initialize form from travel response
  useEffect(() => {
    if (!travel) return;

    setFormData({
      travelTitle: travel.travelTitle,
      location: travel.location,
      purpose: travel.purpose,

      // IMPORTANT for datetime-local input
      startDate: travel.startDate.slice(0, 16),
      endDate: travel.endDate.slice(0, 16),

      maxPerDayAllowance: travel.maxPerDayAllowance,

      employeeIds: travel.travellers.map((empId) => empId),
    });
  }, [travel]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("submitting data :", formData);
      const response = await travelApis.updateTravel(formData, travel.travelId);
      toast.success("Travel updated successfully");
      navigate("/travels");

      setFormData({
        travelTitle: "",
        location: "",
        purpose: "",
        startDate: "",
        maxPerDayAllowance: 0,
        endDate: "",
        employeeIds: [],
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to update travel";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Update Travel
          </h2>

          <input
            name="travelTitle"
            value={formData.travelTitle}
            onChange={handleChange}
            placeholder="Travel Title"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />

          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Purpose"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />

          <label>
            Start Date
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </label>

          <label>
            End Date
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </label>

          <input
            name="maxPerDayAllowance"
            type="number"
            value={formData.maxPerDayAllowance}
            onChange={handleChange}
            placeholder="Max per day allowance"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          <label className="font-semibold">Select Travellers:</label>

          <div className="border rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
            {employees.map((emp) => (
              <label
                key={emp.employeeId}
                className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={formData.employeeIds.includes(emp.employeeId)}
                  onChange={() => toggleEmployee(emp.employeeId)}
                />

                <span>{emp.employeeName}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-gray px-4 py-2 rounded"
          >
            {isLoading ? "Updating..." : "Update Travel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTravelForm;
