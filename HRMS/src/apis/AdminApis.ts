import { api } from "./axios";

export interface EmployeeResponse {
  employeeName: string;
  designation?: string;
  employeeId: number;
  birthDate: string;
  joiningDate: string;
  email: string;
  username: string;
  departmentId: number;
  departmentName: string;
  managerEmployeeName: string;
  managerId: number;
  roleName: string;
  roleId: number;
}

export const adminApis = {
  getAllEmployees: async (): Promise<EmployeeResponse[]> => {
    const response = await api.get<EmployeeResponse[]>("/admin/employees");
    return response.data;
  },

  getEmployeeById: async (): Promise<EmployeeResponse> => {
    const response = await api.get<EmployeeResponse>(
      "/admin/employees/my-profile",
    );
    return response.data;
  },
};
