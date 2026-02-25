import { useState } from "react";
import "./App.css";

export default function App() {
  const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!API_KEY) {
      setError("API key missing. Add VITE_WEATHERAPI_KEY in .env and restart.");
      return;
    }

    let query = city.trim();

    if (!query) {
      setError("Please enter a city.");
      return;
    }

   
    if (!query.includes(",")) {
      query = `${query},India`;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
        query
      )}`;

      const res = await fetch(url);
      const data = await res.json();

     
      if (!res.ok || data?.error) {
        setError(data?.error?.message || "City not found.");
        return;
      }

      setWeather(data);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="page">
      <h1 className="title">Weather UI </h1>

      <div className="searchRow">
        <input
          className="input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter city (e.g., Delhi)"
        />

        <button className="btn" onClick={fetchWeather}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="card">
          <h2>
            {weather.location.name}, {weather.location.country}
          </h2>

          <p>
            Local time: {weather.location.localtime} • Lat: {weather.location.lat} • Lon:{" "}
            {weather.location.lon}
          </p>

          <img src={`https:${weather.current.condition.icon}`} alt="icon" />

          <p><b>Condition:</b> {weather.current.condition.text}</p>
          <p><b>Temperature:</b> {weather.current.temp_c} °C</p>
          <p><b>Feels like:</b> {weather.current.feelslike_c} °C</p>
          <p><b>Humidity:</b> {weather.current.humidity}%</p>
          <p><b>Pressure:</b> {weather.current.pressure_mb} mb</p>
          <p><b>Wind:</b> {weather.current.wind_kph} kph</p>
          <p><b>Visibility:</b> {weather.current.vis_km} km</p>
        </div>
      )}
    </div>
  );
}
