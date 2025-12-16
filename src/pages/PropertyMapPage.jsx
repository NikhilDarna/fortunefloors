import React, { useState, useEffect } from "react";
import axios from "axios";
import LocationSearch from "../components/LocationSearch";
import MapView from "../components/MapView";

const API = import.meta.env.VITE_API_URL; // ensure this is set in .env

export default function PropertyMapPage() {
  const [center, setCenter] = useState([17.385, 78.4867]);
  const [ads, setAds] = useState([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    // fetch properties from backend; if no backend available, ads will be empty but map still works
    (async () => {
      try {
        const res = await axios.get(`${API}/properties`);
        setAds(res.data || []);
      } catch (err) {
        console.warn("Could not fetch properties:", err?.message || err);
        setAds([]);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Search Location & View Ads</h2>

      <LocationSearch
        onSelect={(loc) => {
          setCenter([parseFloat(loc.lat), parseFloat(loc.lon)]);
          setShowMap(true); // open the map when a selection is made
        }}
        onOpenMap={() => setShowMap(true)}
      />

      {showMap && (
        <div style={{ marginTop: 20 }}>
          <MapView
            center={center}
            setCenter={(c) => setCenter(c)}
            ads={ads}
            onSelect={(loc) => {
              // when user clicks the map to pin
              console.log("User selected on map:", loc);
            }}
          />
        </div>
      )}
    </div>
  );
}
