// components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <img src="./logo.png" alt="Logo" className="h-12 w-auto rounded-xl" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/" onClick={() => setIsOpen(false)} className="block">
            Home
          </Link>
          <Link
            to="/planner"
            onClick={() => setIsOpen(false)}
            className="block"
          >
            Travel Planner
          </Link>
          <Link to="/saved" onClick={() => setIsOpen(false)} className="block">
            Previous Plans
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
