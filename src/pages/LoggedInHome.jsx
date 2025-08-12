// LoggedInHome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./LoggedInHome.css";

const dummyEchoes = [
  { id: 1, lat: 40.7128, lng: -74.006, text: "Echo: A future message." },
  { id: 2, lat: 40.715, lng: -74.001, text: "Echo: From a friend." },
];

const LoggedInHome = ({ user }) => {
  const navigate = useNavigate();
  const [menuStage, setMenuStage] = useState(0); // 0=closed, 1=two buttons, 2=three buttons

  const cycleMenu = () => setMenuStage((s) => (s + 1) % 3);

  const goInbox = () => {
    navigate("/inbox");
    setMenuStage(0);
  };

  const openFilter = () => {
    alert("Filter modal opened");
    setMenuStage(0);
  };

  const openNearby = () => {
    alert("Nearby echo list toggled");
    setMenuStage(0);
  };

  return (
    <div className="loggedin-home-container">
      <MapContainer
        center={[40.7128, -74.006]}
        zoom={13}
        scrollWheelZoom
        className="home-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {dummyEchoes.map((echo) => (
          <Marker key={echo.id} position={[echo.lat, echo.lng]}>
            <Popup>{echo.text}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Action Buttons */}
      <div className="floating-ui">
        {/* Main FAB cycles through 0 -> 1 -> 2 -> 0 */}
        <button
          className="fab bottom-left fab-main"
          aria-label="Menu"
          onClick={cycleMenu}
        >
          <span className="fab-bars" />
        </button>

        {/* Stage 1+2: Inbox above */}
        <button
          className={`fab-mini fab-above ${menuStage >= 1 ? "open" : ""}`}
          aria-label="Inbox"
          onClick={goInbox}
          title="Inbox"
        >
          📋
        </button>

        {/* Stage 1+2: Filter to the right */}
        <button
          className={`fab-mini fab-right ${menuStage >= 1 ? "open" : ""}`}
          aria-label="Filter"
          onClick={openFilter}
          title="Filter"
        >
          ⚙️
        </button>

        {/* Stage 2: Nearby diagonal */}
        <button
          className={`fab-mini fab-diag ${menuStage >= 1 ? "open" : ""}`}
          aria-label="Nearby Echoes"
          onClick={openNearby}
          title="Nearby Echoes"
        >
          📍
        </button>

        {/* Optional other FABs */}
        <button className="fab bottom-right" aria-label="Create">＋</button>
        <button className="fab top-right" aria-label="Profile">👤</button>
      </div>
    </div>
  );
};

export default LoggedInHome;
