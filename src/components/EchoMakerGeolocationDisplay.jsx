import React, { useCallback, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function EchoMakerGeolocationDisplay({ formData, setFormData }) {
  const [draggable, setDraggable] = useState(false);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setFormData({
            ...formData,
            lat: marker.getLatLng().lat,
            lng: marker.getLatLng().lng,
          });
        }
      },
    }),
    [],
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return formData.lat && formData.lng ? (
    <div className="map-container">
      <p>
        Latitude: {formData.lat}, Longitude: {formData.lng}
      </p>
      <MapContainer
        center={[formData.lat, formData.lng]}
        zoom={15}
        className="leaflet-map-container"
      >
        <div className="overlay">Click on marker to move</div>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable={draggable}
          eventHandlers={eventHandlers}
          position={[formData.lat, formData.lng]}
          ref={markerRef}
        >
          <Popup>
            <span onClick={toggleDraggable}>
              {draggable
                ? "Marker is now draggable"
                : "Click here to make marker draggable"}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  ) : null;
}
