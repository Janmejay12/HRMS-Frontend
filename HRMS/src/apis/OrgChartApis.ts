import { api } from "./axios";

export interface OrgChartNodeResponse {
  employeeId: number;
  employeeName: string;
  designation: string | null;
}

export interface OrgChartResponse {
  managerialChain: OrgChartNodeResponse[];
  directReports: OrgChartNodeResponse[];
  selectedNode: OrgChartNodeResponse;
}

export interface OrgChartNode {
  id: number;
  pid?: number | null;
  name: string;
  title: string;
}

export function buildOrgChartData(response: OrgChartResponse) {
  const nodes: any[] = [];

  let previousId: number | undefined = undefined;

  // managerial chain
  response.managerialChain.forEach((emp) => {
    const node: any = {
      id: emp.employeeId,
      name: emp.employeeName,
      title: emp.designation,
    };

    if (previousId !== undefined) {
      node.pid = previousId;
    }

    nodes.push(node);

    previousId = emp.employeeId;
  });

  // direct reports
  const selectedId = response.selectedNode?.employeeId ?? previousId;

  response.directReports.forEach((emp) => {
    // prevent duplicate insertion if already in managerialChain
    if (!nodes.some((n) => n.id === emp.employeeId)) {
      nodes.push({
        id: emp.employeeId,
        pid: selectedId,
        name: emp.employeeName,
        title: emp.designation ?? "Employee",
      });
    }
  });

  console.log("Final OrgChart nodes:", nodes);

  return nodes;
}

export const OrgChartApis = {
  getOrgChart: async (employeeId: number): Promise<OrgChartResponse> => {
    const response = await api.get<OrgChartResponse>(
      `/employees/${employeeId}/org-charts`,
    );
    return response.data;
  },
};
