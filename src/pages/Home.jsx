import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import "./HomeStyles.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Home = ({ user }) => {
  if (user) {
    return <LoggedInHome user={user} />;
  }

  return (
    <div className="home-container">
      <MapContainer
        center={[40.7128, -74.006]} // Example: NYC
        zoom={13}
        scrollWheelZoom={false}
        className="home-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[40.7128, -74.006]}>
          <Popup>Echo: A message waits here.</Popup>
        </Marker>
      </MapContainer>

      <div className="home-overlay">
        <h1 className="home-title">EchoCache</h1>
        <p className="home-tagline">Save a message for your future self — or someone else</p>

        <div className="home-buttons">
          <Link to="/signup" className="home-btn">Sign Up</Link>
          <Link to="/login" className="home-btn secondary">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
