import { api } from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
export interface ForgotPasswordRequest {
  email: string;
}

export interface PasswordResetRequest {
  password: string;
  token: string | null;
}

export const authApis = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },
  forgotPassword: async (request: ForgotPasswordRequest): Promise<void> => {
    await api.post<void>("/auth/forgot-password",request);
  },

  resetPassword: async (request: PasswordResetRequest): Promise<void> => {
    await api.post<void>("/auth/reset-password",request);
  },
};
