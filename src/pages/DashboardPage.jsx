// DashboardPage.jsx
import React, { useEffect, useState } from "react";
import EchoList from "../components/EchoList";
import EchoPopup from "../components/EchoPopup";
import EchoMapPreview from "../components/EchoMapPreview";
import "./DashboardStyles.css";
import { API_URL } from "../shared";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Inbox");
  const [echoes, setEchoes] = useState([]);

  // History is persisted
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("echo_history") || "[]"); }
    catch { return []; }
  });

  // persist helper that accepts either an array or an updater function
  const saveHistory = (nextOrUpdater) => {
    setHistory(prev => {
      const next = typeof nextOrUpdater === "function" ? nextOrUpdater(prev) : nextOrUpdater;
      try { localStorage.setItem("echo_history", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const [popupEcho, setPopupEcho] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Inbox/Saved from API (History is local). Also remove any IDs already in history to avoid duplicates.
  useEffect(() => {
    if (activeTab === "History") return;

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
        if (!cancelled) {
          const list = Array.isArray(data) ? data : [];
          // drop anything already in history
          const filtered = list.filter(e => !history.some(h => h.id === e.id));
          setEchoes(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch echoes:", err);
        if (!cancelled) setError("Could not load echoes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [activeTab, history]);

  // Click card: open if unlocked (including in History); otherwise unlock if time reached.
  const handleEchoClick = async (id) => {
    const list = activeTab === "History" ? history : echoes;
    const echo = list.find(e => e.id === id);
    if (!echo) return;

    const now = Date.now();
    const unlockAt = echo.unlock_datetime ? new Date(echo.unlock_datetime).getTime() : 0;

    // Already unlocked → just show
    if (echo.client_unlocked || echo.is_unlocked || activeTab === "History") {
      setPopupEcho(echo);
      return;
    }

    // Time reached → unlock, move to history, popup
    if (unlockAt && now >= unlockAt) {
      try {
        // optimistic UI
        setEchoes(prev => prev.map(e => e.id === id ? { ...e, is_unlocked: true } : e));

        const res = await fetch(`${API_URL}/api/echoes/${id}/unlock`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const updated = await res.json();

        // remove from inbox, add to history (dedupe)
        setEchoes(prev => prev.filter(e => e.id !== id));
        saveHistory(prev => [updated, ...prev.filter(e => e.id !== id)]);

        setPopupEcho(updated);
      } catch (err) {
        console.error("Unlock via click failed:", err);
        setEchoes(prev => prev.map(e => e.id === id ? { ...e, is_unlocked: false } : e));
        alert("Failed to unlock. Please try again.");
      }
    }
  };

  // Explicit Unlock button: same as above but always tries PATCH
  const handleUnlock = async (id) => {
    try {
      setEchoes(prev => prev.map(e => e.id === id ? { ...e, is_unlocked: true } : e));
      const res = await fetch(`${API_URL}/api/echoes/${id}/unlock`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();

      setEchoes(prev => prev.filter(e => e.id !== id));
      saveHistory(prev => [updated, ...prev.filter(e => e.id !== id)]);

      setPopupEcho(updated);
    } catch (err) {
      console.error("Unlock failed:", err);
      setEchoes(prev => prev.map(e => e.id === id ? { ...e, is_unlocked: false } : e));
      alert("Failed to unlock. Please try again.");
    }
  };

  const listToShow = activeTab === "History" ? history : echoes;

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
          {activeTab !== "History" && loading && <p>Loading echoes…</p>}
          {activeTab !== "History" && error && <p className="error">{error}</p>}
          {!(activeTab !== "History" && (loading || error)) && (
            <EchoList
              echoes={listToShow}
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
          onClick={() => window.location.href = "/"}
          aria-label="Close and return to homepage"
        >
          ✕
        </button>
        <EchoMapPreview
          echoes={listToShow}
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
