import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const dummyEchoes = [
  { id: 1, lat: 40.7128, lng: -74.006, text: "Echo: A future message." },
  { id: 2, lat: 40.715, lng: -74.001, text: "Echo: From a friend." },
];

const LoggedInHome = ({ user }) => {
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

    </div>
  );
};

export default LoggedInHome;
