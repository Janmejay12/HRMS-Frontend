import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApis, type LoginRequest } from "../../apis/authApis";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="min-h-screen flex text-center items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form
          onSubmit={handleLogin}
          className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
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
            <div className="flex justify-end">
              <Link
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
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
    </div>
  );
};

export default Login;
