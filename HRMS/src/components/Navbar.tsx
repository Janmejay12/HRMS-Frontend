import {
  Briefcase,
  BriefcaseBusiness,
  Crown,
  Home,
  Joystick,
  LogOut,
  Plane,
  Settings,
  Share2,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <div>
      <nav className="bg-gray-700 p-4 shadow-lg rounded">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">ROIMA HRMS</div>

          {/* Navigation Links and Buttons Section */}
          <div className="flex items-center space-x-6">
            <a
              href="/"
              className="text-gray-300 hover:text-white transition duration-300 flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <Link
              to="/travels"
              className="text-gray-300 hover:text-white transition duration-300 flex items-center space-x-2"
            >
              <Plane className="w-4 h-4" />
              <span>Travels</span>
            </Link>
            <a
              href="/posts"
              className="text-gray-300 hover:text-white transition duration-300 flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Socials</span>
            </a>

            <a
              href="/games"
              className="text-gray-300 hover:text-white transition duration-300 flex items-center space-x-2"
            >
              <Joystick className="w-4 h-4" />
              <span>Games</span>
            </a>

            <a
              href="/organization"
              className="text-gray-300 hover:text-white transition duration-300 flex items-center space-x-2"
            >
              <BriefcaseBusiness className="w-4 h-4" />
              <span>Organization</span>
            </a>

            <a
              href="/jobs"
              className="text-gray-300 hover:text-white transition duration-300 flex items-center space-x-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Jobs</span>
            </a>

            {/* Action Buttons */}

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-gray font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
