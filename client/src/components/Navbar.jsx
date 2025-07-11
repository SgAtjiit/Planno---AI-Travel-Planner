// components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-700 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <a href="/">
          <img src="./logo.png" alt="" className="w-4px h-20 rounded-2xl" />
        </a>
        <div className="space-x-6">
          <Link to="/" className="hover:underline">
            Home
          </Link>

          <Link to="/planner" className="hover:underline">
            Travel Planner
          </Link>
          <Link to="/saved" className="hover:underline">
            Previous Plans
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
