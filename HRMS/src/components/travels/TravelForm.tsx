import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  travelApis,
  type createTravelRequest,
  type travelResponse,
} from "../../apis/travelApis";
import { adminApis, type EmployeeResponse } from "../../apis/AdminApis";
import { toast } from "sonner";

const TravelForm: React.FC = () => {
  const [formData, setFormData] = useState<createTravelRequest>({
    travelTitle: "",
    location: "",
    purpose: "",
    startDate: "",
    maxPerDayAllowance: 0,
    endDate: "",
    employeeIds: [],
    statusId: 1,
  });
  const [travelResponse, setTravelResponse] = useState<travelResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("submitting data :", formData);

      const response = await travelApis.createTravel(formData);
      setTravelResponse(response);
      toast.success("Travel created successfully");
      setFormData({
        travelTitle: "",
        location: "",
        purpose: "",
        startDate: "",
        maxPerDayAllowance: 0,
        endDate: "",
        employeeIds: [],
        statusId: 1,
      });
    } catch (err: any) {
      setError("Failed to fetch travel data");
      toast.error(err.response?.data);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Create Travel Request
        </h2>

        <input
          name="travelTitle"
          placeholder="Travel Title"
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <textarea
          name="purpose"
          placeholder="Purpose"
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        <label>
          Start Date:{" "}
          <input
            type="datetime-local"
            name="startDate"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
        <label>
          End Date:{" "}
          <input
            type="datetime-local"
            name="endDate"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
        <input
          name="maxPerDayAllowance"
          type="number"
          value={formData.maxPerDayAllowance}
          placeholder="Maximun per day allowance :"
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        <label>Select Employees (Hold Ctrl/Cmd to select multiple):</label>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">
            Select Travellers:
          </label>
          <div className="border rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
            {employees.map((emp) => (
              <label
                key={emp.employeeId}
                className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded"
                  checked={formData.employeeIds.includes(
                    Number(emp.employeeId),
                  )}
                  onChange={() => toggleEmployee(Number(emp.employeeId))}
                />
                <span className="text-sm text-gray-500">
                  {emp.employeeName}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            {formData.employeeIds.length} employees selected
          </p>
        </div>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default TravelForm;
