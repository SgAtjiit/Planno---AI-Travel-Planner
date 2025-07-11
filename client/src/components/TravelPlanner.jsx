import React, { useEffect, useState } from "react";
import genAI from "../utils/gemini";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

const TravelPlanner = () => {
  const cleanText = (text) => {
    return text.replace(/#/g, "").replace(/\*/g, "");
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    nod: "",
    budget: "",
    city: "",
    members: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (
      !formData.destination ||
      !formData.nod ||
      !formData.budget ||
      !formData.city ||
      !formData.members
    ) {
      alert("Please Enter all your details");
      return;
    }

    setPlan("");
    setLoading(true);
    const prompt = `Plan a ${formData.nod}-day trip to ${formData.destination} from ${formData.city} for ${formData.members}members within a budget of ₹${formData.budget}. Return a short itinerary in simple words.`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      const newPlan = {
        destination: formData.destination,
        nod: formData.nod,
        budget: formData.budget,
        plan: text,
        city: formData.city,
        members: formData.members,
      };

      // Store in localStorage
      const existing = JSON.parse(localStorage.getItem("travelPlans")) || [];
      existing.push(newPlan);
      localStorage.setItem("travelPlans", JSON.stringify(existing));
      setSubmitted(true);
      setPlan(text);

      alert("Your Plan is Ready");
    } catch (error) {
      console.error(error);
      alert("Error fetching plan. Try again.");
    }

    setFormData({
      destination: "",
      nod: "",
      budget: "",
      city: "",
      members: "",
    });
    setLoading(false);
  };
  useEffect(() => {
    const savedPlan = localStorage.getItem("tripPlan");
    if (savedPlan) {
      setPlan(savedPlan);
      setSubmitted(true);
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-start py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        ✈️ AI Travel Planner
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-xl space-y-4">
        <input
          type="text"
          name="city"
          placeholder="Enter your city"
          value={formData.city}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-500"
        />
        <input
          type="text"
          name="destination"
          placeholder="Enter your destination"
          value={formData.destination}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-500"
        />

        <input
          type="number"
          name="nod"
          placeholder="Enter number of days"
          value={formData.nod}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-500"
        />
        <input
          type="number"
          name="members"
          placeholder="Enter number of members"
          value={formData.members}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-500"
        />
        <input
          type="number"
          name="budget"
          placeholder="Enter your budget in ₹"
          value={formData.budget}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
        >
          Generate Travel Plan
        </button>
      </div>
      {loading && (
        <div className="flex justify-center mt-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {submitted && (
        <div className="mt-10 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            🎉 Your Travel Plan is Ready
          </h2>

          <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md overflow-y-auto max-h-[500px]">
            <pre className="whitespace-pre-wrap font-sans text-gray-800">
              {cleanText(plan)}
            </pre>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                onClick={() => {
                  navigator.clipboard.writeText(cleanText(plan));
                  alert("Copied to clipBoard");
                }}
              >
                Copy Plan
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition mt-4"
        onClick={() => {
          navigate("/saved");
        }}
      >
        See Previous Plans
      </button>
    </div>
  );
};

export default TravelPlanner;
