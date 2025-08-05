// EchoCard.jsx
import React from "react";
import "./EchoCard.css";

const EchoCard = ({ echo, onClick, onUnlock }) => {
  const handleUnlock = (e) => {
    e.stopPropagation(); // prevent parent onClick (if viewing full echo)
    onUnlock?.(echo.id);
  };

  return (
    <div className="echo-card" onClick={() => onClick?.(echo.id)}>
      <div className="echo-header">
        {echo.show_sender_name && (
          <span className="echo-sender">From: User {echo.sender_id}</span>
        )}
        <span className={`echo-type ${echo.type}`}>{echo.type.toUpperCase()}</span>
      </div>

      {/* Echo Text or Locked Placeholder */}
      <p className="echo-text">
        {echo.is_unlocked ? echo.text : "🔒 Locked — unlock to reveal."}
      </p>

      {/* Unlock Button */}
      {!echo.is_unlocked && (
        <button className="unlock-btn" onClick={handleUnlock}>
          Unlock
        </button>
      )}

      <div className="echo-meta">
        <span className="echo-unlock">Unlocks: {echo.unlock_datetime}</span>
        <span className={`echo-status ${echo.is_unlocked ? "unlocked" : "locked"}`}>
          {echo.is_unlocked ? "Unlocked" : "Locked"}
        </span>
      </div>

      {/* Tags */}
      {echo.tags?.length > 0 && (
        <div className="echo-tags">
          {echo.tags.map((tag, idx) => (
            <span key={idx} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      {/* Reactions */}
      {echo.reaction_summary && (
        <div className="echo-reactions">
          {Object.entries(echo.reaction_summary).map(([type, count]) => (
            <span key={type} className="reaction">
              {type} ({count})
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EchoCard;
