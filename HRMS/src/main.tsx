import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login.tsx";
import Navbar from "./components/Navbar.tsx";
import Index from "./pages/Index.tsx";
import TravelHome from "./pages/TravelHome.tsx";
import TravelForm from "./components/travels/TravelForm.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";

const AppLayout = () => {
  ``;

  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <Index /> },
          { path: "/travels", element: <TravelHome /> },
          { path: "/travel-form", element: <TravelForm /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>,
);
