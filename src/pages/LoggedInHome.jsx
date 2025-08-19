import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./LoggedInHome.css";
import L from "leaflet";
import EchoList from "../components/EchoList";
import EchoPopup from "../components/EchoPopup";
import { API_URL } from "../shared";
import FriendsPanel from "../components/FriendsPanel";

const USER_RADIUS_METERS = 167;
const GEOLOCK_VISIBILITY_RADIUS = 1200;
const INITIAL_ZOOM = 15;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Smooth recenter helper
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, map.getZoom(), { duration: 0.75 });
  }, [position, map]);
  return null;
};

// 🦇 user location marker as a divIcon
const batIcon = L.divIcon({
  className: "bat-marker",
  html: "🦇",
  iconSize: [70, 70],
  iconAnchor: [14, 14],
});

const LoggedInHome = ({ user }) => {
  const navigate = useNavigate();
  const currentUserId = user?.id ?? null;

  // FAB stages: 0=closed, 1=inbox+filter+nearby (your existing menu)
  const [menuStage, setMenuStage] = useState(0);

  // Profile mini-menu stage: 0=closed, 1=show friends/logout
  const [profileStage, setProfileStage] = useState(0);

  // Friends popup
  const [friendsOpen, setFriendsOpen] = useState(false);

  // Live geolocation
  const [position, setPosition] = useState(null); // {lat, lng}
  const [geoError, setGeoError] = useState(null);
  const watchIdRef = useRef(null);

  // All echoes for homepage logic (expects backend to filter by visibility)
  const [allEchoes, setAllEchoes] = useState([]);
  const [loadErr, setLoadErr] = useState(null);

  // Slide-in panel state
  const [nearbyOpen, setNearbyOpen] = useState(false);
  const [nearTab, setNearTab] = useState("nongeo"); // "nongeo" | "geolocked" | "opened"

  // Opened IDs (local history)
  const [openedIds, setOpenedIds] = useState(() => {
    try { return new Set((JSON.parse(localStorage.getItem("echo_history") || "[]")).map(e => e.id)); }
    catch { return new Set(); }
  });

  // Popup for freshly opened echo
  const [popupEcho, setPopupEcho] = useState(null);

  // Start continuous geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported.");
      return;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setGeoError(err.message || "Unable to get your location."),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    return () => {
      if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // Fetch unified list
  useEffect(() => {
    const load = async () => {
      try {
        setLoadErr(null);
        let res = await fetch(`${API_URL}/api/echoes/home`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          res = await fetch(`${API_URL}/api/echoes`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAllEchoes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Load echoes failed:", e);
        setAllEchoes([]);
        setLoadErr("Could not load echoes.");
      }
    };
    load();
  }, []);

  // Distance (Haversine)
  const distanceM = (a, b) => {
    if (!a || !b) return Infinity;
    const toRad = (d) => (d * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  };

  // Helpers
  const isRecent = (e) =>
    !e?.unlock_datetime || (Date.now() - new Date(e.unlock_datetime).getTime() <= THIRTY_DAYS_MS);
  const isOwn = (e) => currentUserId && e.user_id === currentUserId;
  const isFriendVisible = (e) =>
    e.recipient_type === "friend" ||
    (e.recipient_type === "custom" && (e.is_recipient || isOwn(e)));

  // Map markers (geolocked only) with special rules
  const mapMarkers = useMemo(() => {
    const pos = position;
    return allEchoes
      .filter((e) => e.location_locked && e.lat && e.lng)
      .filter(isRecent)
      .filter((e) => {
        if (isOwn(e)) return true;
        if (isFriendVisible(e)) return true;
        if (e.recipient_type === "public") {
          if (!pos) return false;
          return distanceM(pos, { lat: e.lat, lng: e.lng }) <= GEOLOCK_VISIBILITY_RADIUS;
        }
        return false;
      });
  }, [allEchoes, position]);

  // ---- Panel lists ----
  const openedEchoes = useMemo(
    () => allEchoes.filter((e) => openedIds.has(e.id)),
    [allEchoes, openedIds]
  );

  const nonGeolockedEchoes = useMemo(() => {
    return allEchoes
      .filter(isRecent)
      .filter((e) => !openedIds.has(e.id))
      .filter((e) => !e.location_locked)
      .filter((e) => e.recipient_type === "public" || isOwn(e) || isFriendVisible(e));
  }, [allEchoes, openedIds]);

  const geolockedNearbyEchoes = useMemo(() => {
    if (!position) return [];
    return allEchoes
      .filter(isRecent)
      .filter((e) => !openedIds.has(e.id))
      .filter((e) => e.location_locked && e.lat && e.lng)
      .filter((e) => e.recipient_type === "public" || isOwn(e) || isFriendVisible(e))
      .filter((e) => distanceM(position, { lat: e.lat, lng: e.lng }) <= USER_RADIUS_METERS);
  }, [allEchoes, openedIds, position]);

  // ---- Unlock + Open handlers ----
  const persistToHistory = (unlockedEcho) => {
    try {
      const prev = JSON.parse(localStorage.getItem("echo_history") || "[]");
      const next = [unlockedEcho, ...prev.filter(e => e.id !== unlockedEcho.id)];
      localStorage.setItem("echo_history", JSON.stringify(next));
    } catch {}
    setOpenedIds(prev => new Set(prev).add(unlockedEcho.id));
  };

  const doUnlock = async (id) => {
    // find in any list we have locally
    const echo =
      allEchoes.find(e => e.id === id) ||
      nonGeolockedEchoes.find(e => e.id === id) ||
      geolockedNearbyEchoes.find(e => e.id === id);
    if (!echo) return;

    try {
      // optimistic: show popup immediately as unlocked
      setPopupEcho({ ...echo, client_unlocked: true });

      const res = await fetch(`${API_URL}/api/echoes/${id}/unlock`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();

      // persist to history and hide from unopened tabs
      persistToHistory(updated);
      setPopupEcho(updated);
    } catch (err) {
      console.error("Unlock failed:", err);
      alert("Failed to unlock. Please try again.");
      setPopupEcho(null);
    }
  };

  const handleEchoClick = (id) => {
    // If it's already opened, show it; otherwise try to unlock (server enforces time/visibility).
    if (openedIds.has(id)) {
      const e = openedEchoes.find(x => x.id === id) || allEchoes.find(x => x.id === id);
      if (e) setPopupEcho(e);
      return;
    }
    doUnlock(id);
  };

  const handleUnlock = (id) => doUnlock(id);

  // ==== FAB actions ====
  const cycleMenu = () => { setMenuStage((s) => (s + 1) % 3); setProfileStage(0); };
  const goInbox = () => { navigate("/inbox"); setMenuStage(0); setProfileStage(0); };
  const openFilter = () => { alert("Filter modal opened"); setMenuStage(0); setProfileStage(0); };
  const toggleNearby = () => { setNearbyOpen((v) => !v); setMenuStage(0); setProfileStage(0); };
  const goEchoMaker = () => { navigate("/echo-maker"); setMenuStage(0); setProfileStage(0); };
  const goProfile = () => {
    if (currentUserId) navigate(`/profile/${currentUserId}`);
    else navigate("/login");
    setMenuStage(0);
    setProfileStage(0);
  };

  // Profile main: first click shows mini actions, second click jumps to profile
  const onProfileMain = () => {
    if (profileStage === 0) setProfileStage(1);
    else goProfile();
  };

  // Close profile mini menu with Escape
  useEffect(() => {
    if (profileStage === 0) return;
    const onKey = (e) => { if (e.key === "Escape") setProfileStage(0); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [profileStage]);

  // Logout helper
  const doLogout = async () => {
    try { await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" }); } catch {}
    setProfileStage(0);
    navigate("/login");
    window.location.reload();
  };

  // Close Nearby panel with Escape
  useEffect(() => {
    if (!nearbyOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setNearbyOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nearbyOpen]);

  const mapCenter = useMemo(
    () => (position ? [position.lat, position.lng] : [40.7128, -74.006]),
    [position]
  );

  return (
    <div className="loggedin-home-container">
      {/* Overlay to close Nearby on outside click */}
      {nearbyOpen && (
        <div className="nearby-overlay" onClick={() => setNearbyOpen(false)} aria-hidden="true" />
      )}

      <MapContainer center={mapCenter} zoom={INITIAL_ZOOM} scrollWheelZoom className="home-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {position && <RecenterMap position={[position.lat, position.lng]} />}

        {/* 🦇 user marker + purple echo radius */}
        {position && (
          <>
            <Marker position={[position.lat, position.lng]} icon={batIcon}>
              <Popup>Your location</Popup>
            </Marker>
            <Circle
              center={[position.lat, position.lng]}
              radius={USER_RADIUS_METERS}
              pathOptions={{ color: "#7c3aed", fillColor: "#a78bfa", fillOpacity: 0.18 }}
            />
          </>
        )}

        {/* Map markers per rules */}
        {mapMarkers.map((echo) => (
          <Marker key={echo.id} position={[echo.lat, echo.lng]}>
            <Popup>
              {echo.is_unlocked ? echo.text : "🔒 Locked Echo"}
              <br />
              {echo.show_sender_name ? `From User ${echo.user_id}` : "Anonymous"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {loadErr && <div className="error-banner">{loadErr}</div>}

      {/* Slide-in panel with tabs */}
      <aside
        className={`nearby-panel ${nearbyOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Nearby echoes"
      >
        <div className="nearby-header">
          <div style={{ display: "flex", gap: 6 }}>
            <button className={`tab ${nearTab === "nongeo" ? "active" : ""}`} onClick={() => setNearTab("nongeo")}>
              Non-Geolocked
            </button>
            <button className={`tab ${nearTab === "geolocked" ? "active" : ""}`} onClick={() => setNearTab("geolocked")}>
              Geolocked (nearby)
            </button>
            <button className={`tab ${nearTab === "opened" ? "active" : ""}`} onClick={() => setNearTab("opened")}>
              Opened
            </button>
          </div>
          <div className="nearby-controls">
            {nearTab === "geolocked" && <span className="radius-fixed">Radius: ~0.167 km</span>}
            <button className="nearby-close" onClick={() => setNearbyOpen(false)} aria-label="Close nearby panel">✕</button>
          </div>
        </div>

        <div className="nearby-list">
          {nearTab === "nongeo" && (
            <EchoList echoes={nonGeolockedEchoes} onEchoClick={handleEchoClick} onUnlock={handleUnlock} />
          )}
          {nearTab === "geolocked" && (
            position ? (
              <EchoList echoes={geolockedNearbyEchoes} onEchoClick={handleEchoClick} onUnlock={handleUnlock} />
            ) : (
              <p className="nearby-msg">{geoError || "Getting your location…"}</p>
            )
          )}
          {nearTab === "opened" && (
            <EchoList
              echoes={openedEchoes}
              onEchoClick={(id) => {
                const e = openedEchoes.find(x => x.id === id);
                if (e) setPopupEcho(e);
              }}
              onUnlock={() => {}}
            />
          )}
        </div>
      </aside>

      {/* Floating Action Buttons */}
      <div className="floating-ui">
        <button className="fab bottom-left fab-main" aria-label="Menu" onClick={cycleMenu}>
          <span className="fab-bars" />
        </button>
        <button className={`fab-mini fab-above ${menuStage >= 1 ? "open" : ""}`} aria-label="Inbox" onClick={goInbox} title="Inbox">📋</button>
        <button className={`fab-mini fab-right ${menuStage >= 1 ? "open" : ""}`} aria-label="Filter" onClick={openFilter} title="Filter">⚙️</button>
        <button className={`fab-mini fab-diag ${menuStage >= 1 ? "open" : ""}`} aria-label="Nearby Echoes" onClick={toggleNearby} title="Nearby Echoes">📍</button>

        {/* Create */}
        <button className="fab bottom-right" aria-label="Create" onClick={goEchoMaker} title="Create Echo">＋</button>

        {/* Profile main (two-stage) */}
        <button className="fab top-right" aria-label="Profile" onClick={onProfileMain} title="Profile">👤</button>
        {/* Stage 1 mini actions (show when profileStage >= 1) */}
        <button
          className={`fab-mini fab-tr-left ${profileStage >= 1 ? "open" : ""}`}
          aria-label="Friends"
          onClick={() => { setProfileStage(0); setMenuStage(0); setFriendsOpen(true); }}
          title="Friends"
        >👥</button>
        <button
          className={`fab-mini fab-tr-below ${profileStage >= 1 ? "open" : ""}`}
          aria-label="Logout"
          onClick={doLogout}
          title="Logout"
        >⎋</button>
      </div>

      {/* Friends popup */}
      {friendsOpen && (
        <FriendsPanel
          open={friendsOpen}
          onClose={() => setFriendsOpen(false)}
          user={user}
        />
      )}

      {/* 🔓 Unlock popup */}
      {popupEcho && <EchoPopup echo={popupEcho} onClose={() => setPopupEcho(null)} />}
    </div>
  );
};

export default LoggedInHome;
