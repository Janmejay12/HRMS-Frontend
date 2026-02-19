interface OrgChartNode {
  id: string;
  name: string;
  designation: string;
}

interface OrgChartResponse {
  managerialChain: OrgChartNode[]; 
  directReports: OrgChartNode[];  
  selectedEmployee: OrgChartNode;
}

