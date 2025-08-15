// EchoPopup.jsx
import React from "react";
import "./EchoPopup.css";

const EchoPopup = ({ echo, onClose }) => {
  if (!echo) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup-title">Unlocked Echo</h2>
        <p className="popup-text">{echo.text}</p>
        <p className="popup-sender">
          From: {echo.show_sender_name ? `User ${echo.sender_id}` : "Anonymous"}
        </p>
        <button className="popup-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EchoPopup;
