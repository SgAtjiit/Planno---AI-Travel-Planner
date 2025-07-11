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
    <div className="p-4 text-white dark:text-white ">
      <h2 className="text-2xl font-bold mb-4 text-red-600">
        Your Saved Travel Plans 📚
      </h2>
      {plans.length === 0 ? (
        <p>No plans found.</p>
      ) : (
        plans.map((plan, index) => (
          <div
            key={index}
            className="bg-gray-800 dark:bg-gray-700 rounded-lg p-4 mb-4 shadow-md"
          >
            <h3 className="text-xl font-semibold">{plan.destination}</h3>
            <p className="text-0.5xl font-semibold">From : {plan.city}</p>
            <p>
              <strong>Days:</strong> {plan.nod}
            </p>
            <p>
              <strong>Members:</strong> {plan.nod}
            </p>
            <p>
              <strong>Budget:</strong> ₹{plan.budget}
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-cyan-300">
                View Plan
              </summary>
              <pre className="whitespace-pre-wrap mt-2">
                {cleanText(plan.plan)}
              </pre>
            </details>
          </div>
        ))
      )}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        onClick={() => {
          navigate("/planner");
        }}
      >
        Make New Plans
      </button>
    </div>
  );
};

export default SavedPlans;
