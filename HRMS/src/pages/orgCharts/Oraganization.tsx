import { useEffect, useMemo, useState } from "react";
import { adminApis, type EmployeeResponse } from "../../apis/AdminApis";
import {
  buildOrgChartData,
  OrgChartApis,
  type OrgChartNode,
} from "../../apis/OrgChartApis";
import OrgChartComponent from "../../components/orgCharts/OrgChartComponent";
import { toast } from "sonner";

const Oraganization = () => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeResponse | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orgChartNodes, setOrgChartNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    var fetchedEmployees = await adminApis.getAllEmployees();
    setEmployees(fetchedEmployees);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [employees, searchTerm]);

  const handleNodeClick = (employeeId: number) => {
    const employee = employees.find((e) => e.employeeId === employeeId);

    if (employee) {
      setSelectedEmployee(employee);
    }
  };

  useEffect(() => {
    if (selectedEmployee) {
      setLoading(true);
      fetchOrgChart(selectedEmployee.employeeId);
    }
  }, [selectedEmployee]);

  const fetchOrgChart = async (id: number): Promise<void> => {
    try {
      setLoading(true);

      const data = await OrgChartApis.getOrgChart(id);
      toast.success("Org Chart Created");
      if (!data) {
        toast.error("Failed fetching OrgChart of the selected employee");
        setOrgChartNodes([]);
        setLoading(false);
        return;
      }

      const nodes = buildOrgChartData(data);

      if (!nodes || nodes.length === 0) {
        console.warn("No org chart nodes built");
        setOrgChartNodes([]);
      } else {
        setOrgChartNodes(nodes);
      }
    } catch (error) {
      toast.error("Failed fetching OrgChart of the selected employee");
      setOrgChartNodes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl items-center text-center mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Organization Chart
      </h1>

      {/* Dropdown */}
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Dropdown List */}
        {dropdownOpen && (
          <div className="absolute w-full bg-white border rounded-lg shadow-md mt-2 max-h-60 overflow-y-auto z-20">
            {filteredEmployees.length === 0 && (
              <p className="p-3 text-gray-500 text-sm">No employees found</p>
            )}

            {filteredEmployees.map((emp) => (
              <button
                key={emp.employeeId}
                onClick={() => {
                  setSelectedEmployee(emp);
                  setSearchTerm(emp.employeeName);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left
                hover:bg-gray-100 transition
                ${
                  selectedEmployee?.employeeId === emp.employeeId
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                  {emp.employeeName.charAt(0)}
                </div>

                {/* Employee Info */}
                <div>
                  <p className="font-medium text-gray-800">
                    {emp.employeeName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && <p className="mt-6 text-gray-500">Loading Org Chart...</p>}

      {/* Org Chart */}
      {orgChartNodes.length > 0 && !loading && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow border">
          <OrgChartComponent
            nodes={orgChartNodes}
            onNodeClick={handleNodeClick}
          />
        </div>
      )}
    </div>
  );
};

export default Oraganization;
