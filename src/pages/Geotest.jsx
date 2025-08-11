// GeoTest.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Create a custom user location icon (e.g., "You are here" marker)
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Create a custom echo icon (used when user drops an echo pin)
const echoIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// 🔄 RecenterMap component: changes the map's view when `trigger` changes
const RecenterMap = ({ trigger, lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (trigger && lat && lng) {
      map.setView([lat, lng], 15); // recenter to user position with zoom level 15
    }
  }, [trigger, lat, lng, map]);

  return null; // does not render any JSX; just side-effect for map control
};

const GeoTest = () => {
  const [position, setPosition] = useState(null);         // User's current location
  const [echoes, setEchoes] = useState([]);               // List of dropped echoes
  const [recenterTrigger, setRecenterTrigger] = useState(false); // Triggers map recenter
  const initialPositionRef = useRef(null);                // Stores first known user position

  // 🌍 Get user's location and keep it updated
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(coords); // update user's location in state
          if (!initialPositionRef.current) {
            initialPositionRef.current = coords; // save initial position only once
          }
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          alert("Location access denied or unavailable.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId); // cleanup on unmount
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  // 📍 Drop a new echo at current user location
  const handleDropEcho = () => {
    if (position) {
      setEchoes((prev) => [...prev, { ...position, id: Date.now() }]);
    }
  };

  // 🔘 Trigger the map to recenter to the user's current location
  const handleRecenter = () => {
    setRecenterTrigger(true); // toggles RecenterMap to activate
    setTimeout(() => setRecenterTrigger(false), 100); // reset trigger for next use
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {position && (
        <MapContainer center={[position.lat, position.lng]} zoom={15} style={{ height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Recenter logic, only activates when trigger is toggled */}
          <RecenterMap trigger={recenterTrigger} lat={position.lat} lng={position.lng} />

          {/* User's current location marker */}
          <Marker position={[position.lat, position.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Render all dropped echo markers */}
          {echoes.map((echo) => (
            <Marker key={echo.id} position={[echo.lat, echo.lng]} icon={echoIcon}>
              <Popup>Echo pinned here!</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* Floating UI buttons (bottom center of screen) */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          gap: "10px",
        }}
      >
        {/* Drop Echo button */}
        <button
          onClick={handleDropEcho}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Drop Echo Here
        </button>

        {/* Recenter button */}
        <button
          onClick={handleRecenter}
          style={{
            padding: "10px 20px",
            backgroundColor: "rgb(40, 167, 69)",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Recenter
        </button>
      </div>
    </div>
  );
};

export default GeoTest;
