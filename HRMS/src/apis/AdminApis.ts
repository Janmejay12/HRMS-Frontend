import { api } from "./axios";

export interface EmployeeResponse {
  employeeName: string;
  designation?: string;
  employeeId: number;
  birthDate: Date;
  joiningDate: Date;
  email: string;
  username: string;
  departmentId: number;
  managerId: number;
  roleId: number;
}

export const adminApis = {
  getAllEmployees: async (): Promise<EmployeeResponse[]> => {
    const response = await api.get<EmployeeResponse[]>("/admin/employees");
    return response.data;
  },
};
