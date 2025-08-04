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

const RecenterMap = ({ lat, lng, onCenter }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
      onCenter?.();
    }
  }, [lat, lng, map, onCenter]);
  return null;
};

const GeoTest = () => {
  const [position, setPosition] = useState(null);
  const [echoes, setEchoes] = useState([]);
  const [hasCentered, setHasCentered] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleDropEcho = () => {
    if (position) {
      setEchoes([...echoes, { ...position, id: Date.now() }]);
    }
  };

  const handleRecenter = () => {
    if (mapRef.current && position) {
      mapRef.current.setView([position.lat, position.lng], 15);
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {position && (
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          style={{ height: "100%", zIndex: 0 }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {!hasCentered && (
            <RecenterMap
              lat={position.lat}
              lng={position.lng}
              onCenter={() => setHasCentered(true)}
            />
          )}
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

      {/* Drop Echo Button */}
      <button
        onClick={handleDropEcho}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Drop Echo Here
      </button>

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        style={{
          position: "absolute",
          bottom: "70px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "8px 16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Recenter
      </button>
    </div>
  );
};

export default GeoTest;
