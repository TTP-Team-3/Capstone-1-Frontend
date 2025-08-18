import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EchoMaker.css";
import EchoMakerTagsInput from "../components/EchoMakerTagsInput";
import EchoMakerRecipientTypeInput from "../components/EchoMakerRecipientTypeInput";
import EchoMakerGeolocationDisplay from "../components/EchoMakerGeolocationDisplay";
import axios from "axios";
import { API_URL } from "../shared";
import EchoMakerFileInput from "../components/EchoMakerFileInput";

export default function EchoMaker({ user }) {
  const [formData, setFormData] = useState({
    echo_name: "",
    media: [],
    text: "",
    tags: [],
    show_sender_name: true,
    unlock_datetime: "",
    recipient_type: "",
    customRecipients: [],
    location_locked: false,
    lat: 0,
    lng: 0,
  });
  console.log(formData.media);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/");
  //   }
  // }, []);

  function checkForErrors() {
    const errors = {};
    if (!formData.echo_name) {
      errors["echo_name"] = "Please give your echo a name!";
    }
    if (!formData.text) {
      errors["text"] = "Please give your echo a description!";
    }
    if (!formData.tags.length) {
      errors["tags"] = "Atleast 1 tag is required!";
    }
    if (formData.recipient_type === "") {
      errors["recipient_type"] = "Please choose a recipient type!";
    }
    if (
      formData.recipient_type === "custom" &&
      formData.customRecipients.length === 0
    ) {
      errors["customRecipients"] = "Please include users to share with.";
    }
    if (formData.unlock_datetime === "") {
      errors["unlock_datetime"] = "Please enter an unlock date and time!";
    }
    const now = new Date();
    const unlock_datetime = new Date(formData.unlock_datetime);
    if (unlock_datetime <= now) {
      errors["unlock_datetime"] = "Unlock date and time must be in the future!";
    }
    return errors;
  }

  async function createEcho(event) {
    event.preventDefault();
    if (Object.keys(checkForErrors()).length !== 0) {
      return setErrors(checkForErrors());
    }

    const formDataToSend = new FormData();
    if (formData.media && formData.media.length > 0) {
      formData.media.forEach((file) => {
        formDataToSend.append("media", file);
      });
    }

    if (formData.tags && formData.tags.length > 0) {
      formData.tags.forEach((tag) => {
        formDataToSend.append("tags", tag);
      });
    }

    if (formData.userIds.length > 0) {
      formData.userIds.forEach((userId) => {
        formDataToSend.append("userIds", userId);
      });
    }

    const otherKeys = Object.keys(formData).filter(
      (key) => key !== "media" && key !== "tags" && key !== "userIds",
    );
    otherKeys.forEach((key) => {
      if (formData[key] !== "" && formData[key] != null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (
      formDataToSend.recipient_type !== "custom" &&
      formDataToSend.userIds &&
      formDataToSend.userIds.length > 0
    ) {
      formDataToSend.userIds = [];
    }

    await axios.post(`${API_URL}/api/echoes/`, formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
  }

  function handleChange(event) {
    const { checked, name, value } = event.target;
    setErrors({});
    if (name === "show_sender_name") {
      setFormData({
        ...formData,
        [name]: !formData.show_sender_name,
      });
    } else if (name === "media") {
      if (formData.media.length >= 10) {
        alert("Maximum number of files exceeded");
        event.target.value = null;
        return;
      }
      const file = event.target.files[0];
      if (file.size > Math.pow(10, 9)) {
        alert("File size exceeds limit(1GB). File not added");
        event.target.value = null;
        return;
      }
      const currentFileNames = formData.media.map((file) => file.name);
      if (currentFileNames.includes(file.name)) {
        const overwrite = confirm(
          "File with this name already exists. Would you like to overwrite it?",
        );
        if (overwrite) {
          let currentMedia = formData.media;
          currentMedia = currentMedia.filter(
            (media) => media.name !== file.name,
          );
          currentMedia.push(file);
          setFormData({
            ...formData,
            [name]: currentMedia,
          });
          return;
        } else {
          return;
        }
      }
      const temp = [...formData.media];
      console.log(file);
      temp.push(file);
      setFormData({
        ...formData,
        [name]: temp,
      });
    } else if (name === "tags") {
      const temp = [...formData[name]];
      temp.push(value);
      setFormData({
        ...formData,
        [name]: temp,
      });
    } else if (name === "userIds") {
      const temp = [...formData.userIds];
      temp.push(Number(value));
      setFormData({
        ...formData,
        [name]: temp,
      });
    } else if (name === "location_locked") {
      if (checked) {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        };
        function success(position) {
          setFormData({
            ...formData,
            [name]: true,
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          });
        }
        function error(error) {
          console.error(error);
        }
        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        setFormData({
          ...formData,
          [name]: false,
          lng: 0,
          lat: 0,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  return (
    <div className="echo-maker-container">
      <form className="create-echo-form" onSubmit={createEcho}>
        <label htmlFor="echo_name">Echo Name:</label>
        <input
          type="text"
          className="echo-name-input"
          name="echo_name"
          value={formData.echo_name}
          onChange={handleChange}
        />
        <label className="echo-media-label" htmlFor="media">
          Select Media
        </label>
        <EchoMakerFileInput
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
        />
        <label htmlFor="text">Description:</label>
        <textarea
          name="text"
          className="echo-textarea"
          id="text"
          onChange={handleChange}
          value={formData.text}
        ></textarea>
        <EchoMakerTagsInput
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
        />
        <label htmlFor="show_sender_name">
          <input
            type="checkbox"
            name="show_sender_name"
            onChange={handleChange}
            checked={formData.show_sender_name}
          />
          Show name
        </label>
        <label htmlFor="location_locked">
          <input
            type="checkbox"
            name="location_locked"
            onChange={handleChange}
            checked={formData.location_locked}
          />
          Pin on my location
        </label>
        <label htmlFor="unlock_datetime">Unlock Time:</label>
        <input
          type="datetime-local"
          name="unlock_datetime"
          onChange={handleChange}
          value={formData.unlock_datetime}
        />
        <EchoMakerRecipientTypeInput
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
        />
        <button type="submit" className="create-echo-button">
          Create Echo
        </button>
        {Object.values(errors).map((error, index) => (
          <p key={error + index} className="error-message">
            {error}
          </p>
        ))}
      </form>
      <EchoMakerGeolocationDisplay
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
