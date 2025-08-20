// EchoPopup.jsx
import React, { useEffect, useState } from "react";
import "./EchoPopup.css";
import axios from "axios";
import { API_URL } from "../shared";

const EchoPopup = ({ echo, onClose }) => {
  const [media, setMedia] = useState([]);
  console.log(media);
  if (!echo) return null;
  async function getEchoById() {
    try {
      const data = await axios.get(`${API_URL}/api/echoes/${echo.id}`, {
        withCredentials: true,
      });
      setMedia(data.data.media);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getEchoById();
  }, []);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup-title">Unlocked Echo</h2>
        <p className="popup-text">{echo.text}</p>
        {media.length !== 0 &&
          media.map((file) => {
            if (file.type === "video") {
              return (
                <video
                  className="echo-media echo-video"
                  controls
                >
                  <source src={file.signed_url} width="300px" />
                </video>
              );
            } else {
              return (
                <img
                  key={file.file_size}
                  src={file.signed_url}
                  alt={file.name}
                  width="300px"
                />
              );
            }
          })}
        <p className="popup-sender">
          From: {echo.show_sender_name ? `User ${echo.user_id}` : "Anonymous"}
        </p>
        <button className="popup-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default EchoPopup;
