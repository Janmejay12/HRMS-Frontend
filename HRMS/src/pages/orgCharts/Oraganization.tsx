import { useEffect, useMemo, useState } from "react";
import { adminApis, type EmployeeResponse } from "../../apis/AdminApis";
import {
  buildOrgChartData,
  OrgChartApis,
  type OrgChartNode,
} from "../../apis/OrgChartApis";
import OrgChartComponent from "../../components/orgCharts/OrgChartComponent";

const Oraganization = () => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeResponse | null>(null);
  const [orgChart, setOrgChart] = useState<OrgChartNode | null>(null);
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

      if (!data) {
        console.warn("No data received for Org Chart with ID:", id);
        setOrgChart(null);
        setLoading(false);
        return;
      }
      
      const node = buildOrgChartData(data);
      console.log(node.name)

      if (!node) {
        console.warn("Failed to build org chart data.");
        setOrgChart(null);
      } else {
        setOrgChart(node);
      }
    } catch (error) {
      console.error("Error fetching Org Chart:", error);
      setOrgChart(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Organization Chart</h1>

      <input
        type="text"
        placeholder="Search employee..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>
        {filteredEmployees.map((emp) => (
          <button
            key={emp.employeeId}
            onClick={() => setSelectedEmployee(emp)}
            style={{ marginRight: 10 }}
          >
            {emp.employeeName} ({emp.designation})
          </button>
        ))}
      </div>
      {loading && <p>Loading Org Chart...</p>}
      {orgChart && !loading && (
        <div>
          <OrgChartComponent node={orgChart} />
        </div>
      )}
    </div>
  );
};

export default Oraganization;
