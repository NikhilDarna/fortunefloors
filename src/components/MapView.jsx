import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

// icons (you chose)
const ICON_MARKER = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535239.png",
  iconSize: [28, 36],
  iconAnchor: [14, 36],
});

const ICON_CURRENT = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function ClickToAddMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect && onSelect({ lat, lon: lng });
    },
  });
  return null;
}

function GoToCurrentButton({ setCenter }) {
  // small control using map API
  const map = useMap();
  const goToCurrent = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        map.flyTo([lat, lon], 14, { duration: 0.8 });
        setCenter && setCenter([lat, lon]);
      },
      (err) => {
        console.error("geo error", err);
        alert("Unable to fetch current location.");
      }
    );
  };

  // render button overlayed
  return (
    <div className="lf-go-current" onClick={goToCurrent} title="Go to current location">
      <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="current" />
    </div>
  );
}

export default function MapView({ center = [17.385, 78.4867], setCenter = () => {}, ads = [], onSelect = () => {} }) {
  // ensure center numbers are floats
  const safeCenter = [parseFloat(center[0]) || 17.385, parseFloat(center[1]) || 78.4867];

  return (
    <div className="lf-map-wrapper">
      <MapContainer center={safeCenter} zoom={13} style={{ height: "450px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />

        {/* Selected center marker */}
        <Marker position={safeCenter} icon={ICON_CURRENT}>
          <Popup>Selected Location</Popup>
        </Marker>

        {/* Ads markers */}
        {Array.isArray(ads) &&
          ads.map((ad) => {
            // ad may have lat and lon or lat/lon named differently — try common fields
            const lat = parseFloat(ad.lat ?? ad.latitude ?? ad.lat_dd ?? ad.lat_d);
            const lon = parseFloat(ad.lon ?? ad.longitude ?? ad.lon_dd ?? ad.lon_d);
            if (!lat || !lon) return null;
            return (
              <Marker key={ad.id ?? `${lat}-${lon}`} position={[lat, lon]} icon={ICON_MARKER}>
                <Popup>
                  <b>{ad.title || ad.name || "Property"}</b>
                  <br />
                  {ad.location || ad.display_name || ad.address}
                </Popup>
              </Marker>
            );
          })}

        {/* allow user to click map to pick a location */}
        <ClickToAddMarker
          onSelect={(coords) => {
            // set center and notify parent
            setCenter([coords.lat, coords.lon]);
            onSelect({ lat: coords.lat, lon: coords.lon });
          }}
        />

        {/* button overlay */}
        <GoToCurrentButton setCenter={setCenter} />
      </MapContainer>
    </div>
  );
}
