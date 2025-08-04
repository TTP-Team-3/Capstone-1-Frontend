// GeoTest.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const echoIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Recenter only when manually triggered
const RecenterMap = ({ trigger, lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (trigger && lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [trigger, lat, lng, map]);

  return null;
};

const GeoTest = () => {
  const [position, setPosition] = useState(null);
  const [echoes, setEchoes] = useState([]);
  const [recenterTrigger, setRecenterTrigger] = useState(false);
  const initialPositionRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(coords);
          if (!initialPositionRef.current) {
            initialPositionRef.current = coords;
          }
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          alert("Location access denied or unavailable.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleDropEcho = () => {
    if (position) {
      setEchoes((prev) => [...prev, { ...position, id: Date.now() }]);
    }
  };

  const handleRecenter = () => {
    setRecenterTrigger(true);
    setTimeout(() => setRecenterTrigger(false), 100); // reset trigger
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {position && (
        <MapContainer center={[position.lat, position.lng]} zoom={15} style={{ height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap trigger={recenterTrigger} lat={position.lat} lng={position.lng} />
          <Marker position={[position.lat, position.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
          {echoes.map((echo) => (
            <Marker key={echo.id} position={[echo.lat, echo.lng]} icon={echoIcon}>
              <Popup>Echo pinned here!</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1000, display: "flex", gap: "10px" }}>
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
