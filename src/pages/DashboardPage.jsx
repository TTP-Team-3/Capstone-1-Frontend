import React from "react";
import "./DashboardStyles.css"; // Optional external CSS if you're using it

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      {/* Left Panel: Tabs and Echo List */}
      <div className="dashboard-left">
        <div className="tab-header">
          <button className="tab">My Echoes</button>
          <button className="tab">History</button>
          <button className="tab">Saved</button>
        </div>

        <div className="tab-content">
          <p>[ Echo content goes here... ]</p>
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

