import React, { useState } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import Thankyou from "./components/Thankyou";

import TravelPlanner from "./components/TravelPlanner";
import SavedPlans from "./components/SavedPlans";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thankyou" element={<Thankyou />} />

        <Route path="/planner" element={<TravelPlanner />} />
        <Route path="/saved" element={<SavedPlans />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
