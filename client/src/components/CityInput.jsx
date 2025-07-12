import React, { useState } from "react";
import axios from "axios";

const CityInput = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchCities = async (query) => {
    if (!query) return;
    try {
      const res = await axios.get(
        "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        {
          params: { namePrefix: query },
          headers: {
            "X-RapidAPI-Key": "YOUR_API_KEY",
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );
      setSuggestions(res.data.data.map((city) => city.city));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        placeholder="Enter your city"
        onChange={(e) => {
          onChange(e.target.value);
          fetchCities(e.target.value);
        }}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
      <ul className="absolute bg-white w-full border rounded shadow max-h-40 overflow-y-auto z-10">
        {suggestions.map((city, i) => (
          <li
            key={i}
            onClick={() => {
              onChange(city);
              setSuggestions([]);
            }}
            className="p-2 hover:bg-gray-200 cursor-pointer"
          >
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CityInput;
