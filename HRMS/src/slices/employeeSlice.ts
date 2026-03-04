import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EmployeeResponse } from "../apis/AdminApis";

interface EmployeeState{
    employees : EmployeeResponse[];
    selectedEmployee : EmployeeResponse | null;
    loading : boolean;
}

const initialState: EmployeeState = {
    employees : [],
    selectedEmployee : null,
    loading : false,
}

const employeeSlice = createSlice({
    name : "employees",
    initialState,
    reducers: {
        setEmployees(state, action : PayloadAction<EmployeeResponse[]>){
            state.employees = action.payload;
        },

        setSelectedEmployee(state, action : PayloadAction<EmployeeResponse>){
            state.selectedEmployee = action.payload;
        },

        setLoading(state, action:PayloadAction<boolean>){
            state.loading = action.payload;
        }
    },
});

export const {
    setEmployees,
    setSelectedEmployee,
    setLoading
} = employeeSlice.actions;

export default employeeSlice.reducer;