import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Thankyou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = location.state || { name: "User" };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-4 animate-bounce">
        🎉 Thank You, {name}!
      </h1>
      <p className="text-lg text-gray-700 max-w-xl">
        We appreciate your valuable feedback. <br />
        You’ll be redirected to the homepage in a few seconds...
      </p>
      <div className="mt-10">
        <p className="text-sm text-gray-500 italic">
          Redirecting in 5 seconds ⏳
        </p>
      </div>
    </div>
  );
};

export default Thankyou;
