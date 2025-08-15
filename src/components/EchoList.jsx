// EchoList.jsx
import React from "react";
import EchoCard from "./EchoCard";

const EchoList = ({ echoes, onEchoClick, onUnlock }) => {
  if (!echoes?.length) return <p>No echoes found.</p>;

  return (
    <div className="echo-list">
      {echoes.map((echo) => (
        <EchoCard
          key={echo.id}
          echo={echo}
          onClick={onEchoClick}
          onUnlock={onUnlock}
        />
      ))}
    </div>
  );
};

export default EchoList;
