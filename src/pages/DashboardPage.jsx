import React, { useState } from "react";
import EchoList from "../components/EchoList";
import mockEchoData from "../utils/mockEchoData";
import "./DashboardStyles.css";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Inbox");
  const [echoes, setEchoes] = useState(mockEchoData);

  const handleEchoClick = (id) => {
    console.log("View echo:", id);
    // Redirect or open modal here
  };

  const handleUnlock = (id) => {
    console.log("Unlock echo:", id);
    setEchoes((prev) =>
      prev.map((echo) =>
        echo.id === id ? { ...echo, is_unlocked: true } : echo
      )
    );
  };

  const filteredEchoes = echoes.filter((echo) => {
    if (activeTab === "Inbox") return !echo.is_unlocked;
    if (activeTab === "History") return echo.is_unlocked;
    if (activeTab === "Saved") return echo.is_saved; // placeholder
    return true;
  });

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
    </div>
  );
};

export default DashboardPage;
