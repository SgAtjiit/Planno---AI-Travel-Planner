import React, { useEffect, useState, useRef } from "react";
import genAI from "../utils/gemini";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import indianCities from "../assets/indianCities.json";

const TravelPlanner = () => {
  const cleanText = (text) => text.replace(/#/g, "").replace(/\*/g, "");

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
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  const geoDbApi = axios.create({
    baseURL: "https://wft-geo-db.p.rapidapi.com/v1/geo",
    headers: {
      "X-RapidAPI-Key": "50512256cfmsh1a2c951692c2e7fp1fe13djsn282b932224d6",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  });

  const searchCities = async (query, setSuggestions, setLoadingState) => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    const localResults = indianCities
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
      .map((c) => ({
        city: c.name,
        region: c.state || "",
        country: c.country || "IN",
      }));

    if (localResults.length > 0) {
      setSuggestions(localResults);
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        setLoadingState(true);
        setError(null);
        const res = await geoDbApi.get("/cities", {
          params: {
            namePrefix: q,
            limit: 5,
            countryIds: "IN",
            minPopulation: 10000,
            sort: "-population",
            types: "CITY",
          },
        });
        const data = res.data.data.length
          ? res.data.data
          : (
              await geoDbApi.get("/cities", {
                params: {
                  namePrefix: q.split(",")[0],
                  limit: 5,
                  countryIds: "IN",
                },
              })
            ).data.data;
        setSuggestions(data);
      } catch {
        setSuggestions([]);
        setError("Failed to fetch city suggestions. Please try again.");
      } finally {
        setLoadingState(false);
      }
    }, 300);
  };

  const handleCityChange = async (e) => {
    const v = e.target.value;
    setFormData({ ...formData, city: v });
    await searchCities(v, setCitySuggestions, setLoadingCities);
    setShowCitySuggestions(true);
  };

  const handleDestinationChange = async (e) => {
    const v = e.target.value;
    setFormData({ ...formData, destination: v });
    await searchCities(v, setDestinationSuggestions, setLoadingDestinations);
    setShowDestinationSuggestions(true);
  };

  const selectCity = (c) => {
    const name = c.region
      ? `${c.city}, ${c.region}, ${c.country}`
      : `${c.city}, ${c.country}`;
    setFormData({ ...formData, city: name });
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };

  const selectDestination = (c) => {
    const name = c.region
      ? `${c.city}, ${c.region}, ${c.country}`
      : `${c.city}, ${c.country}`;
    setFormData({ ...formData, destination: name });
    setDestinationSuggestions([]);
    setShowDestinationSuggestions(false);
  };

  const handleSubmit = async () => {
    if (
      !formData.city ||
      !formData.destination ||
      !formData.nod ||
      !formData.members ||
      !formData.budget
    ) {
      alert("Please Enter all your details");
      return;
    }
    setPlan("");
    setLoading(true);
    const prompt = `Plan a ${formData.nod}-day trip to ${formData.destination} from ${formData.city} for ${formData.members} members within a budget of ₹${formData.budget}. Return a short itinerary in simple words.`;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      const newPlan = { ...formData, plan: text };
      const existing = JSON.parse(localStorage.getItem("travelPlans")) || [];
      existing.push(newPlan);
      localStorage.setItem("travelPlans", JSON.stringify(existing));
      setSubmitted(true);
      setPlan(text);
      alert("Your Plan is Ready");
    } catch {
      alert("Error fetching plan. Try again.");
    } finally {
      setFormData({
        city: "",
        destination: "",
        nod: "",
        members: "",
        budget: "",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
        ✈️ AI Travel Planner
      </h1>
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-xl space-y-4">
        <div className="relative">
          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleCityChange}
            onFocus={() => setShowCitySuggestions(true)}
            onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          {showCitySuggestions && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {loadingCities ? (
                <li className="p-2 text-center text-gray-500">Searching...</li>
              ) : citySuggestions.length ? (
                citySuggestions.map((c) => (
                  <li
                    key={`${c.city}-${c.country}`}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => selectCity(c)}
                  >
                    {c.region ? `${c.city}, ${c.region}` : c.city}, {c.country}
                  </li>
                ))
              ) : (
                <li className="p-2 text-center text-gray-500">
                  {formData.city.length
                    ? "No cities found. Try a different name"
                    : "Type at least 2 characters"}
                </li>
              )}
            </ul>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            name="destination"
            placeholder="Enter your destination"
            value={formData.destination}
            onChange={handleDestinationChange}
            onFocus={() => setShowDestinationSuggestions(true)}
            onBlur={() =>
              setTimeout(() => setShowDestinationSuggestions(false), 200)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          {showDestinationSuggestions && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {loadingDestinations ? (
                <li className="p-2 text-center text-gray-500">Searching...</li>
              ) : destinationSuggestions.length ? (
                destinationSuggestions.map((c) => (
                  <li
                    key={`${c.city}-${c.country}`}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => selectDestination(c)}
                  >
                    {c.region ? `${c.city}, ${c.region}` : c.city}, {c.country}
                  </li>
                ))
              ) : (
                <li className="p-2 text-center text-gray-500">
                  {formData.destination.length
                    ? "No destinations found. Try a different name"
                    : "Type at least 2 characters"}
                </li>
              )}
            </ul>
          )}
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <input
          type="number"
          name="nod"
          placeholder="Enter number of days"
          value={formData.nod}
          onChange={(e) => setFormData({ ...formData, nod: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
        <input
          type="number"
          name="members"
          placeholder="Enter number of members"
          value={formData.members}
          onChange={(e) =>
            setFormData({ ...formData, members: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
        <input
          type="number"
          name="budget"
          placeholder="Enter your budget in ₹"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                onClick={() => {
                  navigator.clipboard.writeText(cleanText(plan));
                  alert("Copied to clipboard");
                }}
              >
                Copy Plan
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition mt-6"
        onClick={() => navigate("/saved")}
      >
        See Previous Plans
      </button>
    </div>
  );
};

export default TravelPlanner;
