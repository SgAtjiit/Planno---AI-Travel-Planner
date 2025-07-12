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
    city: "",
    destination: "",
    nod: "",
    members: "",
    budget: "",
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

  const searchCities = (query, setSuggestions, setLoadingState) => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setLoadingState(true);
      setError(null);
      try {
        const local = indianCities
          .filter((c) => c.city.toLowerCase().includes(q))
          .map((c) => ({
            city: c.city,
            region: c.state || "",
            country: c.country || "IN",
          }));

        const globalRes = await geoDbApi.get("/cities", {
          params: {
            namePrefix: q,
            limit: 10,
            minPopulation: 10000,
            sort: "-population",
            types: "CITY",
          },
        });
        const global = globalRes.data.data
          .map((d) => ({
            city: d.name,
            region: d.region || "",
            country: d.countryCode || "",
          }))
          .filter((g) => !local.some((l) => l.city === g.city));

        const combined = [...local, ...global].slice(0, 5);
        setSuggestions(combined);
      } catch {
        setSuggestions([]);
        setError("Failed to fetch city suggestions");
      } finally {
        setLoadingState(false);
      }
    }, 300);
  };

  const handleCityChange = async (e) => {
    const v = e.target.value;
    setFormData({ ...formData, city: v });
    searchCities(v, setCitySuggestions, setLoadingCities);
    setShowCitySuggestions(true);
  };

  const handleDestinationChange = async (e) => {
    const v = e.target.value;
    setFormData({ ...formData, destination: v });
    searchCities(v, setDestinationSuggestions, setLoadingDestinations);
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
    const { city, destination, nod, members, budget } = formData;
    if (!city || !destination || !nod || !members || !budget) {
      alert("Please enter all your details");
      return;
    }
    setLoading(true);
    const prompt = `Plan a ${nod}-day trip to ${destination} from ${city} for ${members} members within a budget of ₹${budget}. Return a short itinerary in simple words.`;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const res = await (await model.generateContent([prompt])).response;
      const text = await res.text();
      const stored = JSON.parse(localStorage.getItem("travelPlans")) || [];
      stored.push({ ...formData, plan: text });
      localStorage.setItem("travelPlans", JSON.stringify(stored));
      setPlan(text);
      setSubmitted(true);
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

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

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
                citySuggestions.map((c, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => selectCity(c)}
                  >
                    {c.region ? `${c.city}, ${c.region}` : c.city}, {c.country}
                  </li>
                ))
              ) : (
                <li className="p-2 text-center text-gray-500">
                  {formData.city.length
                    ? "No cities found"
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
                destinationSuggestions.map((c, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => selectDestination(c)}
                  >
                    {c.region ? `${c.city}, ${c.region}` : c.city}, {c.country}
                  </li>
                ))
              ) : (
                <li className="p-2 text-center text-gray-500">
                  {formData.destination.length
                    ? "No destinations found"
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
