import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom user location icon
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Echo marker icon
const echoIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Helper component to pan to a clicked echo
const EchoFocus = ({ echoes, activeEchoId }) => {
  const map = useMap();

  useEffect(() => {
    if (activeEchoId) {
      const echo = echoes.find((e) => e.id === activeEchoId);
      if (echo?.lat && echo?.lng) {
        map.flyTo([echo.lat, echo.lng], 14, { duration: 1.5 });
      }
    }
  }, [activeEchoId, echoes, map]);

  return null;
};

const EchoMapPreview = ({ echoes, activeEchoId }) => {
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Default map center (Leaflet expects an array, not an object)
  const defaultCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [40.7128, -74.006]; // NYC fallback

  return (
    <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Auto-focus on selected echo */}
      <EchoFocus echoes={echoes} activeEchoId={activeEchoId} />

      {/* Show user's current location */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* Render echo markers only if location-locked and coords exist */}
      {echoes
        .filter((echo) => echo.location_locked && echo.lat && echo.lng)
        .map((echo) => (
          <Marker key={echo.id} position={[echo.lat, echo.lng]} icon={echoIcon}>
            <Popup>
              {echo.is_unlocked ? echo.text : "🔒 Locked Echo"}
              <br />
              {echo.show_sender_name ? `From User ${echo.user_id}` : "Anonymous"}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default EchoMapPreview;
