import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "../slices/employeeSlice"

export const store = configureStore({
    reducer : {
        emloyees : employeeReducer,
    }
});
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;