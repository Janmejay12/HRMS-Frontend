import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Travels",
      description: "Create and manage travel requests and expenses",
      route: "/travels",
      color: "bg-blue-500",
      icon: "✈️",
    },
    {
      title: "Games",
      description: "Book game slots and view your bookings",
      route: "/games",
      color: "bg-green-500",
      icon: "🎮",
    },
    {
      title: "Jobs",
      description: "Explore internal job opportunities",
      route: "/jobs",
      color: "bg-purple-500",
      icon: "💼",
    },
    {
      title: "Organization",
      description: "View company hierarchy and org chart",
      route: "/organization",
      color: "bg-orange-500",
      icon: "🏢",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}

      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">HRMS Dashboard</h1>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <Link to="/create-post" className="font-semibold">Employee</Link>
              <p className="text-sm text-gray-500">Welcome back</p>
            </div>

            <Link to="create-post" className="w-10 h-10 bg-blue-200 text-black rounded-full flex items-center justify-center font-bold-400">
              E
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to HRMS Portal
          </h2>

          <p className="text-gray-600">
            Access all employee services from one place
          </p>
        </div>

        {/* Stats Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Travels</p>
            <p className="text-2xl font-bold mt-2">12</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Game Bookings</p>
            <p className="text-2xl font-bold mt-2">5</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Available Jobs</p>
            <p className="text-2xl font-bold mt-2">3</p>
          </div>
        </div>

        {/* Navigation Section */}

        <h3 className="text-xl font-semibold mb-4">Services</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              onClick={() => navigate(section.route)}
              className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer"
            >
              <div className={`${section.color} h-2 rounded-t-xl`} />

              <div className="p-6">
                <div className="text-3xl mb-3">{section.icon}</div>

                <h4 className="text-lg font-semibold mb-2">{section.title}</h4>

                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
