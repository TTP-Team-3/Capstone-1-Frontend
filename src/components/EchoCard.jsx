import React, { useEffect, useState } from "react";
import "./EchoCard.css";

const EchoCard = ({ echo, onClick, onUnlock }) => {
  const [canUnlock, setCanUnlock] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  // Calculate time remaining until unlock
  useEffect(() => {
    if (!echo.unlock_datetime) return;

    const updateCountdown = () => {
      const now = new Date();
      const unlockTime = new Date(echo.unlock_datetime);
      const diff = unlockTime - now;

      if (diff <= 0) {
        setCanUnlock(true); // Unlock time reached
        setTimeLeft(null);  // Stop countdown
      } else {
        setCanUnlock(false); // Still locked
        setTimeLeft(diff);   // Save time left in ms
      }
    };

    updateCountdown(); // Initial check
    const timer = setInterval(updateCountdown, 1000); // Check every second
    return () => clearInterval(timer); // Clean up on unmount
  }, [echo.unlock_datetime]);

  // Convert ms to readable format (e.g., 1d 2h 3m)
  const formatCountdown = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = totalSeconds % 60;
    const hrs = Math.floor((totalSeconds / 60) % 60);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    return `${days}d ${hrs}h ${mins}m`;
  };

  // Handle click on Unlock button
  const handleUnlock = (e) => {
    e.stopPropagation(); // Don't trigger onClick for the card
    onUnlock?.(echo.id); // Call parent unlock handler
  };

  return (
    <div className="echo-card" onClick={() => onClick?.(echo.id)}>
      {/* Sender + Type */}
      <div className="echo-header">
        {echo.show_sender_name && (
          <span className="echo-sender">From: User {echo.sender_id}</span>
        )}
        <span className={`echo-type ${echo.type}`}>{echo.type.toUpperCase()}</span>
      </div>

      {/* Display Text or Lock Message */}
      <p className="echo-text">
        {echo.is_unlocked ? echo.text : "🔒 Locked — unlock to reveal."}
      </p>

      {/* Unlock Button or Countdown */}
      {!echo.is_unlocked && (
        <>
          {canUnlock ? (
            <button className="unlock-btn" onClick={handleUnlock}>
              Unlock
            </button>
          ) : (
            timeLeft && (
              <p className="echo-countdown">
                Unlocks in: {formatCountdown(timeLeft)}
              </p>
            )
          )}
        </>
      )}

      {/* Unlock Date + Status */}
      <div className="echo-meta">
        <span className="echo-unlock">
          Unlocks: {new Date(echo.unlock_datetime).toLocaleString()}
        </span>
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
