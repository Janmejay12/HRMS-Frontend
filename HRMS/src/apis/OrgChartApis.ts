import { api } from "./axios";

export interface OrgChartNodeResponse {
  id: number;
  name: string;
  designation: string;
}

export interface OrgChartResponse {
  managerialChain: OrgChartNodeResponse[];
  directReports: OrgChartNodeResponse[];
  selectedEmployee: OrgChartNodeResponse;
}

export interface OrgChartNode {
  id: number;
  name: string;
  title: string;
  children?: OrgChartNode[];
  [key: string]: any;
}

export function buildOrgChartData(response: OrgChartResponse): OrgChartNode {
  // Build managerial chain
  let root: OrgChartNode | null = null;
  let current: OrgChartNode | null = null;
  response.managerialChain.forEach((emp, index) => {
    const node: OrgChartNode = {
      id: emp.id,
      name: emp.name,
      title: emp.designation,
      children: [],
    };

    if (!root) {
      root = node;
    } else if (current) {
      current.children!.push(node);
    }
    current = node;

    // If this is the selected employee, attach direct reports
    if (emp.id === response.selectedEmployee.id) {
      console.log(emp.id);
      node.children = response.directReports.map((dr) => ({
        id: dr.id,
        name: dr.name,
        title: dr.designation,

      }));
    }
  });

  return root!;
}

export const OrgChartApis = {
  getOrgChart: async (employeeId: number): Promise<OrgChartResponse> => {
    const response = await api.get<OrgChartResponse>(
      `/employees/${employeeId}/org-charts`,
    );
    return response.data;
  },
};
