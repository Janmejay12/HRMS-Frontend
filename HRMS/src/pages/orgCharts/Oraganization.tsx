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
            {emp.employeeName}
          </button>
        ))}
      </div>
      {loading && <p>Loading Org Chart...</p>}
      {orgChartNodes.length > 0 && !loading && (
        <div>
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
