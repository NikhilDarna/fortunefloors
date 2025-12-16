import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./LocationSearch.css"; // create or merge styles

const GEO_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const GEO_URL_AUTOCOMPLETE = "https://api.geoapify.com/v1/geocode/autocomplete";
const GEO_URL_REVERSE = "https://api.geoapify.com/v1/geocode/reverse";

// Icons (you chose these)
const ICON_CURRENT = "https://cdn-icons-png.flaticon.com/512/684/684908.png"; // blue circle
const ICON_SELECT_MAP = "https://cdn-icons-png.flaticon.com/512/854/854878.png"; // map+pin

export default function LocationSearch({ onSelect = () => {}, onOpenMap = () => {} }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPos, setCurrentPos] = useState(null);
  const debRef = useRef(null);
  const controllerRef = useRef(null);

  // Get browser geolocation once on mount to bias results
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPos({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        // ignore
      },
      { enableHighAccuracy: true, maximumAge: 1000 * 60 * 5 }
    );
  }, []);

  // Debounced autocomplete query
  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);

    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    debRef.current = setTimeout(() => {
      fetchAutocomplete(query);
    }, 350);

    return () => {
      if (debRef.current) clearTimeout(debRef.current);
      if (controllerRef.current) controllerRef.current.abort?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, currentPos]);

  async function fetchAutocomplete(text) {
    try {
      setLoading(true);
      if (controllerRef.current) controllerRef.current.abort?.();
      controllerRef.current = new AbortController();

      const params = new URLSearchParams({
        text,
        apiKey: GEO_KEY,
        limit: "6",
        lang: "en",
        // restrict to India:
        filter: "countrycode:in",
      });

      // If we have current position, bias results toward it
      if (currentPos) {
        params.append("bias", `proximity:${currentPos.lon},${currentPos.lat}`);
      }

      const url = `${GEO_URL_AUTOCOMPLETE}?${params.toString()}`;

      const res = await axios.get(url, { signal: controllerRef.current.signal });
      setResults(res.data.features || []);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Autocomplete error", err?.message || err);
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }

  // Reverse geocode helper (used when user clicks "current location" icon)
  async function reverseGeocode(lat, lon) {
    try {
      const params = new URLSearchParams({
        lat,
        lon,
        apiKey: GEO_KEY,
        lang: "en",
      });
      const url = `${GEO_URL_REVERSE}?${params.toString()}`;
      const res = await axios.get(url);
      const features = res.data?.features;
      if (features && features.length) {
        return features[0];
      }
    } catch (err) {
      console.error("Reverse geocode error", err);
    }
    return null;
  }

  // Click handler for selecting a suggestion feature
  function handleSelect(feature) {
    // feature has geometry.coordinates: [lon, lat]
    const coords = feature?.properties
      ? { lat: feature.properties.lat, lon: feature.properties.lon }
      : feature?.geometry?.coordinates
      ? { lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0] }
      : null;

    if (!coords) return;

    // pass a usable object to parent
    const payload = {
      lat: coords.lat,
      lon: coords.lon,
      display_name: feature.properties ? feature.properties.formatted : feature?.properties?.label || feature?.properties?.name,
      raw: feature,
    };

    onSelect(payload);
    setQuery(payload.display_name || "");
    setResults([]);
  }

  // Get current location -> center map and return selected object
  async function handleCurrentLocationClick() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        // reverse geocode to get a readable label
        const feature = await reverseGeocode(lat, lon);
        const payload = {
          lat,
          lon,
          display_name: feature?.properties?.formatted || "Current location",
          raw: feature,
        };
        onSelect(payload);
        setQuery(payload.display_name);
        setResults([]);
      },
      (err) => {
        console.error("Geolocation error", err);
        alert("Unable to get current position.");
      },
      { enableHighAccuracy: true }
    );
  }

  // When there are no results and user typed > 2 chars, show "Select from map"
  const showSelectFromMap = query.length > 2 && results.length === 0 && !loading;

  return (
    <div className="lf-location-search">
      <div className="lf-search-row">
        <input
          className="lf-search-input"
          placeholder="Search city, area..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          type="button"
          className="lf-icon-btn"
          title="Use current location"
          onClick={handleCurrentLocationClick}
        >
          <img src={ICON_CURRENT} alt="current" />
        </button>

        {/* Option: open the full map (small icon) */}
        <button
          type="button"
          className="lf-icon-btn"
          title="Open map selector"
          onClick={() => {
            onOpenMap();
          }}
        >
          <img src={ICON_SELECT_MAP} alt="map" />
        </button>
      </div>

      {/* suggestions */}
      {loading ? (
        <div className="lf-suggestions">Loading…</div>
      ) : results && results.length ? (
        <ul className="lf-suggestions">
          {results.map((feat, idx) => {
            const label = feat.properties?.formatted || feat.properties?.address_line || feat.properties?.name || feat.properties?.label;
            return (
              <li key={feat?.properties?.place_id || idx} onClick={() => handleSelect(feat)}>
                {label}
              </li>
            );
          })}
        </ul>
      ) : showSelectFromMap ? (
        <div className="lf-no-results">
          <button className="lf-select-map-btn" onClick={() => onOpenMap()}>
            No results found — Select from map
          </button>
        </div>
      ) : null}
    </div>
  );
}
