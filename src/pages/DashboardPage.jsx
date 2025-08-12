// DashboardPage.jsx
import React, { useEffect, useState } from "react";
import EchoList from "../components/EchoList";
import EchoPopup from "../components/EchoPopup"; 
import EchoMapPreview from "../components/EchoMapPreview";
// import mockEchoData from "../utils/mockEchoData";
import "./DashboardStyles.css";
import { API_URL } from "../shared"; 

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Inbox");
  const [echoes, setEchoes] = useState([]);
  const [popupEcho, setPopupEcho] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load echoes for the current tab from the backend
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/echoes?tab=${encodeURIComponent(activeTab)}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setEchoes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch echoes:", err);
        if (!cancelled) setError("Could not load echoes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [activeTab]);

  const handleEchoClick = (id) => {
    console.log("View echo:", id);
  };

  const handleUnlock = async (id) => {
    try {
      // optimistic update
      setEchoes(prev => prev.map(e => e.id === id ? { ...e, is_unlocked: true } : e));

      const res = await fetch(`${API_URL}/api/echoes/${id}/unlock`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();

      setEchoes(prev => prev.map(e => e.id === id ? updated : e));
      setPopupEcho(updated);
    } catch (err) {
      console.error("Unlock failed:", err);
      setEchoes(prev => prev.map(e => e.id === id ? { ...e, is_unlocked: false } : e));
      alert("Failed to unlock. Please try again.");
    }
  };

  const filteredEchoes = echoes;

  return (
    <div className="dashboard-container">
      {/* Left Panel: Echo List */}
      <div className="dashboard-left">
        <div className="tab-header">
          <button className={`tab ${activeTab === "Inbox" ? "active" : ""}`} onClick={() => setActiveTab("Inbox")}>Inbox</button>
          <button className={`tab ${activeTab === "History" ? "active" : ""}`} onClick={() => setActiveTab("History")}>History</button>
          <button className={`tab ${activeTab === "Saved" ? "active" : ""}`} onClick={() => setActiveTab("Saved")}>Saved</button>
        </div>

        <div className="tab-content">
          {loading && <p>Loading echoes…</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <EchoList
              echoes={filteredEchoes}
              onEchoClick={handleEchoClick}
              onUnlock={handleUnlock}
            />
          )}
        </div>
      </div>

      {/* Right Panel: Map Preview */}
      <div className="dashboard-right">
        <button
          className="map-close-btn"
          onClick={() => window.location.href = "/"} // or use navigate("/")
          aria-label="Close and return to homepage"
        >
          ✕
        </button>
        <EchoMapPreview
          echoes={filteredEchoes}
          activeEchoId={popupEcho?.id}
        />
      </div>

      {/* 🔓 Unlock Popup */}
      {popupEcho && (
        <EchoPopup
          echo={popupEcho}
          onClose={() => setPopupEcho(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;