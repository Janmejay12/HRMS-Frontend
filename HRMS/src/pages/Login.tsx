import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApis, type LoginRequest } from "../apis/authApis";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
   const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     if (location.key !== "default") {
  //       navigate(-1);
  //     } else {
  //       navigate("/");
  //     }
  //   }
  // }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all the fields");
    }
    setIsLoading(true);
    try {
      const loginRequest: LoginRequest = { email, password };
      const response = await authApis.login(loginRequest);
      localStorage.setItem("token", response.token);
      const payload = JSON.parse(atob(response.token.split(".")[1]));
      localStorage.setItem("role", payload.role.toString());

      toast.success("Login Succesfull!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleLogin}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-quizrush-purple focus:border-quizrush-purple disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-quizrush-purple focus:border-quizrush-purple disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray bg-quizrush-purple hover:bg-quizrush-light-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-quizrush-purple disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>                              
  );
};

export default Login;
