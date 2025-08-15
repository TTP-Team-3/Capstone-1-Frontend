import React, { useEffect, useState } from "react";
import "./EchoCard.css";

const EchoCard = ({ echo, onClick, onUnlock }) => {
  const [canUnlock, setCanUnlock] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  // countdown to unlock time
  useEffect(() => {
    if (!echo?.unlock_datetime) return;

    const update = () => {
      const now = new Date();
      const unlockAt = new Date(echo.unlock_datetime);
      const diff = unlockAt.getTime() - now.getTime();

      if (diff <= 0) {
        setCanUnlock(true);
        setTimeLeft(null);
      } else {
        setCanUnlock(false);
        setTimeLeft(diff);
      }
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [echo?.unlock_datetime]);

  const formatCountdown = (ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const mins = total % 60;
    const hrs = Math.floor((total / 60) % 60);
    const days = Math.floor(total / (60 * 60 * 24));
    return `${days}d ${hrs}h ${mins}m`;
  };

  const sender =
    echo?.show_sender_name
      ? echo?.sender_username || `User ${echo?.user_id}`
      : "Anonymous";

  const handleUnlock = (e) => {
    e.stopPropagation();
    onUnlock?.(echo.id);
  };

  const clientUnlocked = echo?.client_unlocked === true;

  return (
    <div className="echo-card" onClick={() => onClick?.(echo.id)}>
      {/* Title */}
      <h4 className="echo-title">{echo?.echo_name || "Unnamed Echo"}</h4>

      {/* Recipient type */}
      <div className="echo-type">
        {echo?.recipient_type || "unknown"}
      </div>

      {/* From */}
      <div className="echo-from">from {sender}</div>

      {/* Unlock datetime */}
      {echo?.unlock_datetime && (
        <div className="echo-unlock-line">
          Unlocks: {new Date(echo.unlock_datetime).toLocaleString()}
        </div>
      )}

      {/* Action: countdown OR unlock button */}
      {!clientUnlocked && (
        <>
          {canUnlock ? (
            <button className="unlock-btn" onClick={handleUnlock}>
              Unlock
            </button>
          ) : (
            timeLeft != null && (
              <div className="echo-countdown">
                Unlocks in: {formatCountdown(timeLeft)}
              </div>
            )
          )}
        </>
      )}

      {/* Optional status badge if parent sets client_unlocked after PATCH */}
      {clientUnlocked && <div className="echo-status unlocked">Unlocked</div>}
    </div>
  );
};

export default EchoCard;
