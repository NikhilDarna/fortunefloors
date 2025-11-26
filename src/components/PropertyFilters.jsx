import { useEffect, useState } from "react";
import "./PropertyFilters.css";

const PropertyFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const [locations, setLocations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [minPriceSlider, setMinPriceSlider] = useState(0);
  const [above1Cr, setAbove1Cr] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMinSliderChange = (e) => {
    const value = Number(e.target.value);
    setMinPriceSlider(value);
    const newFilters = {
      ...filters,
      minPrice: value,
      maxPrice: filters.maxPrice || 10000000,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAbove1CrClick = () => {
    const active = !above1Cr;
    setAbove1Cr(active);
    const newFilters = {
      ...filters,
      minPrice: active ? 10000000 : "",
      maxPrice: "",
    };
    setMinPriceSlider(active ? 10000000 : 0);
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser does not support voice recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript.trim();
      transcript = transcript.replace(/[.,;!?]+$/, "");
      setFilters((prev) => ({ ...prev, location: transcript }));
      onFilterChange({ ...filters, location: transcript });
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
    };
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state_district ||
            "Nearby";

          setFilters((prev) => ({ ...prev, location: city }));
          onFilterChange({
            ...filters,
            location: city,
            lat: latitude,
            lon: longitude,
          });
        } catch (error) {
          console.error("Error fetching location:", error);
          alert("Could not fetch your location.");
        }
      },
      (error) => {
        console.error(error);
        alert("Unable to get your location.");
      }
    );
  };

  const handleLocationInput = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, location: value }));

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = locations.filter((loc) =>
      loc.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
    onFilterChange({ ...filters, location: value });
  };

  const handleSuggestionClick = (loc) => {
    setFilters((prev) => ({ ...prev, location: loc }));
    setSuggestions([]);
    onFilterChange({ ...filters, location: loc });
  };

  const clearFilters = () => {
    const cleared = { location: "", minPrice: "", maxPrice: "" };
    setFilters(cleared);
    setMinPriceSlider(0);
    setAbove1Cr(false);
    onFilterChange(cleared);
    setSuggestions([]);
  };

  return (
    <div className="property-filters">
      <div className="filters-container">
        {/* 📍 Location Input */}
        <div className="filter-group location-group">
          <label htmlFor="location">Location</label>
          <div className="location-input">
            <input
              type="text"
              id="location"
              placeholder="Enter city or area"
              value={filters.location}
              onChange={handleLocationInput}
              autoComplete="off"
            />
            <button
              onClick={handleVoiceSearch}
              className="icon-btn mic-btn"
              title="Voice Search"
            >
              🎤
            </button>
            <button
              onClick={handleGetLocation}
              className="icon-btn loc-btn"
              title="Use My Location"
            >
              📍
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((loc, index) => (
                <li key={index} onClick={() => handleSuggestionClick(loc)}>
                  {loc}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 💰 Price Range */}
        <div className="filter-group">
          <label htmlFor="minPrice">Price From (₹)</label>
          <input
            type="number"
            id="minPrice"
            placeholder="Enter minimum price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice">Price To (₹)</label>
          <input
            type="number"
            id="maxPrice"
            placeholder="Enter maximum price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </div>

        {/* 🧭 Drag Min Price */}
        <div className="filter-group price-slider-group">
          <div className="price-header">
            <label>Drag to Increase Minimum Price</label>
            <button
              type="button"
              onClick={handleAbove1CrClick}
              className={`above-1cr-btn ${above1Cr ? "active" : ""}`}
            >
              {above1Cr ? "Showing Above ₹1 Cr" : "Above ₹1 Cr"}
            </button>
          </div>

          <div className="price-slider">
            <input
              type="range"
              min="0"
              max="10000000"
              step="10000"
              value={minPriceSlider}
              onChange={handleMinSliderChange}
              disabled={above1Cr}
            />
          </div>

          <div className="price-values">
            <span>Min: ₹{minPriceSlider.toLocaleString()}</span>
            <span>Max: ₹{(filters.maxPrice || 10000000).toLocaleString()}</span>
          </div>
        </div>

        {/* ❌ Clear Filters */}
        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
