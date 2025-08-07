import React, { useState } from "react";
import EchoList from "../components/EchoList";
import EchoPopup from "../components/EchoPopup"; 
import mockEchoData from "../utils/mockEchoData";
import "./DashboardStyles.css";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Inbox");
  const [echoes, setEchoes] = useState(mockEchoData);
  const [popupEcho, setPopupEcho] = useState(null); 

  // When a user clicks on an echo card
  const handleEchoClick = (id) => {
    console.log("View echo:", id);
    // Future enhancement: navigate to single echo view or open full modal
  };

  // Unlock echo by ID and show popup
  const handleUnlock = (id) => {
    console.log("Unlock echo:", id);

    // Update unlocked state in echo list
    setEchoes((prev) =>
      prev.map((echo) =>
        echo.id === id ? { ...echo, is_unlocked: true } : echo
      )
    );

    // Find the unlocked echo to show in popup
    const unlocked = echoes.find((echo) => echo.id === id);
    if (unlocked) {
      setPopupEcho({ ...unlocked, is_unlocked: true });
    }
  };

  // Filter echoes by tab
  const filteredEchoes = echoes.filter((echo) => {
    if (activeTab === "Inbox") return !echo.is_unlocked;
    if (activeTab === "History") return echo.is_unlocked;
    if (activeTab === "Saved") return echo.is_saved; // Placeholder logic
    return true;
  });

  return (
    <div className="dashboard-container">
      {/* Left Panel: Echo List */}
      <div className="dashboard-left">
        <div className="tab-header">
          <button
            className={`tab ${activeTab === "Inbox" ? "active" : ""}`}
            onClick={() => setActiveTab("Inbox")}
          >
            Inbox
          </button>
          <button
            className={`tab ${activeTab === "History" ? "active" : ""}`}
            onClick={() => setActiveTab("History")}
          >
            History
          </button>
          <button
            className={`tab ${activeTab === "Saved" ? "active" : ""}`}
            onClick={() => setActiveTab("Saved")}
          >
            Saved
          </button>
        </div>

        <div className="tab-content">
          <EchoList
            echoes={filteredEchoes}
            onEchoClick={handleEchoClick}
            onUnlock={handleUnlock}
          />
        </div>
      </div>

      {/* Right Panel: Map Preview */}
      <div className="dashboard-right">
        <p>[ Map Preview Component Placeholder ]</p>
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
