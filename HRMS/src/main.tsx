import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
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
import TravelForm from "./components/travels/TravelForm.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import JobsHome from "./pages/jobs/JobsHome.tsx";
import Oraganization from "./pages/orgCharts/Oraganization.tsx";
import GamesHome from "./pages/games/GamesHome.tsx";
import GameSlots from "./pages/games/GameSlots.tsx";
import MyBookings from "./pages/games/MyBookings.tsx";
import CreatePost from "./components/posts/CreatePost.tsx";
import PostsHome from "./pages/posts/PostsHome.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import Unauthorized from "./pages/Unauthorized.tsx";
import TravelHome from "./pages/travels/TravelHome.tsx";
import UpdateTravelPage from "./pages/travels/UpdateTravelPage.tsx";
import Profile from "./pages/posts/Profile.tsx";

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
          {
            path: "/travel-form",
            element: (
              // <RoleProtectedLayout allowedRole={"HR"}>
                <TravelForm />
              //</RoleProtectedLayout>
            ),
          },
          { path: "/jobs", element: <JobsHome /> },
          { path: "/organization", element: <Oraganization /> },
          { path: "/games", element: <GamesHome /> },
          { path: "/games/:gameId", element: <GameSlots /> },
          { path: "/my-bookings", element: <MyBookings /> },
          { path: "/create-post", element: <CreatePost /> },
          { path: "/posts", element: <PostsHome /> },
          { path: "/profile", element: <Profile /> },
          { path: "/:id/update-travel", element: <UpdateTravelPage /> },
          { path: "/unauthorized", element: <Unauthorized /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
