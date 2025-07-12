import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SavedPlans = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  const cleanText = (text) => {
    return text.replace(/#/g, "").replace(/\*/g, "");
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("travelPlans")) || [];
    setPlans(saved);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-3xl font-bold mb-2 text-center text-red-600">
          Your Saved Travel Plans 📚
        </h2>

        {plans.length === 0 ? (
          <p className="text-center text-gray-600">No plans found.</p>
        ) : (
          plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 rounded-lg p-4 shadow-md space-y-2"
            >
              <h3 className="text-xl font-semibold">{plan.destination}</h3>
              <p className="text-sm font-semibold">From: {plan.city}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <p>
                  <strong>Days:</strong> {plan.nod}
                </p>
                <p>
                  <strong>Members:</strong> {plan.nod}
                </p>
                <p>
                  <strong>Budget:</strong> ₹{plan.budget}
                </p>
              </div>
              <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-blue-600 font-medium">
                  View Plan
                </summary>
                <pre className="whitespace-pre-wrap mt-2 text-gray-700 bg-gray-100 p-3 rounded">
                  {cleanText(plan.plan)}
                </pre>
              </details>
            </div>
          ))
        )}

        <div className="flex justify-center pt-6">
          <button
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
            onClick={() => {
              navigate("/planner");
            }}
          >
            Make New Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedPlans;
