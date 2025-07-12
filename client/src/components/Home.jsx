import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.feedback) {
      alert("Please Enter all your details");
      return;
    }
    if (!formData.email.includes("@")) {
      alert("Please enter valid email");
      return;
    } else {
      alert("FeedBack Submitted succesfully");
      navigate("/thankyou", { state: { name: formData.name } });
      setFormData({ name: "", email: "", feedback: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-start px-4 py-10 space-y-10">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
          🌏 Welcome to AI Travel Planner
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Plan your dream trip in seconds using AI. Just enter your destination,
          city, members, days, and budget – we’ll handle the rest!
        </p>
      </div>

      <img
        src="./image1.jpeg"
        alt="Travel map"
        className="rounded-xl shadow-lg w-full max-w-3xl object-cover"
      />

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => navigate("/planner")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          🧭 Start Planning Now
        </button>
        <button
          onClick={() => navigate("/saved")}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          📚 View Saved Plans
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg shadow-md max-w-3xl mx-auto my-8">
        <p className="text-gray-700 text-lg leading-relaxed">
          🌍{" "}
          <span className="font-semibold text-blue-700">AI Travel Planner</span>{" "}
          is your smart companion for stress-free trip planning! Just enter your{" "}
          <span className="font-medium text-blue-600">destination</span>, your{" "}
          <span className="font-medium text-blue-600">city</span>, number of{" "}
          <span className="font-medium text-blue-600">days</span>, number of{" "}
          <span className="font-medium text-blue-600">members</span>, and your{" "}
          <span className="font-medium text-blue-600">budget</span> — and let AI
          instantly craft a personalized travel itinerary. Save and revisit your
          past plans anytime, all in one elegant interface. ✈️💼
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-blue-100 w-full flex justify-center pt-10 pb-20 px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-5">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            🧑 FeedBack Form
          </h2>

          <input
            type="text"
            placeholder="Enter your Name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="feedback"
            placeholder="Enter your FeedBack"
            value={formData.feedback}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={() => setFormData({ name: "", email: "", feedback: "" })}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              Clear
            </button>
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>

          {formData.name && (
            <p className="text-sm text-gray-700">
              🧑 You typed Name: {formData.name}
            </p>
          )}
          {formData.email && (
            <p className="text-sm text-gray-700">
              📧 You typed Email: {formData.email}
            </p>
          )}
          {formData.feedback && (
            <p className="text-sm text-gray-700">
              💬 You typed FeedBack: {formData.feedback}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
