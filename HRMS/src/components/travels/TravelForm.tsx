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
import { api } from "../../apis/axios";
import { adminApis, type EmployeeResponse } from "../../apis/AdminApis";

const TravelForm: React.FC = () => {
  const [formData, setFormData] = useState<createTravelRequest>({
    travelTitle: "",
    location: "",
    purpose: "",
    startDate: "",
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
    };

    fetchEmployees();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedIds: number[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(options[i].value);
      }
    }
    setFormData({ ...formData, employeeIds: selectedIds });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    setIsLoading(true);
    try {
      const response = await travelApis.createTravel(formData);
      setTravelResponse(response);
      console.log("Travel request successful:", response);
    } catch (err) {
      setError("Failed to fetch travel data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <h2>Create Travel Request</h2>

        <input
          name="travelTitle"
          placeholder="Travel Title"
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />
        <textarea
          name="purpose"
          placeholder="Purpose"
          onChange={handleChange}
          required
        />

        <label>
          Start Date:{" "}
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End Date:{" "}
          <input type="date" name="endDate" onChange={handleChange} required />
        </label>

        <label>Select Employees (Hold Ctrl/Cmd to select multiple):</label>

        <select
          multiple={true}
          value={formData.employeeIds}
          onChange={handleEmployeeChange}
        >
          {employees.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.employeeName}
            </option>
          ))}
        </select>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default TravelForm;
