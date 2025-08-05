import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EchoMaker.css";
import EchoMakerTagsInput from "../components/EchoMakerTagsInput";
import EchoMakerTypeInput from "../components/EchoMakerTypeInput";

export default function EchoMaker({ user }) {
  const [formData, setFormData] = useState({
    echoName: "",
    media: [],
    description: "",
    tags: [],
    anonymous: false,
    unlock_datetime: "",
    type: "",
    friends: [],
    geolocation: "",
  });
  console.log(formData);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/");
  //   }
  // }, []);

  function checkForErrors() {
    const errors = {};
    if (!formData.echoName) {
      errors["echoName"] = "Please give your echo a name!";
    }
    if (!formData.tags.length) {
      errors["tags"] = "Atleast 1 tag is required!";
    }
    if (formData.type === "") {
      errors["type"] = "Please choose a type!";
    }
    if (formData.type === "friends" && formData.friends.length === 0) {
      errors["friends"] = "Please include friends to share with.";
    }
    if (formData.unlock_datetime === "") {
      errors["unlock_datetime"] = "Please enter an unlock date and time!";
    }
    return errors;
  }

  function createEcho(event) {
    event.preventDefault();
    if (checkForErrors()) {
      return setErrors(checkForErrors());
    }

    console.log(formData);
  }

  function handleChange(event) {
    const { checked, name, value } = event.target;
    setErrors({});
    if (name === "anonymous") {
      setFormData({
        ...formData,
        [name]: !formData.anonymous,
      });
    } else if (name === "tags") {
      const temp = formData.tags;
      temp.push(value);
      setFormData({
        ...formData,
        [name]: temp,
      });
    } else if (name === "friends") {
      const temp = formData.friends;
      temp.push(Number(value));
      setFormData({
        ...formData,
        [name]: temp,
      });
    } else if (name === "geolocation") {
      if (checked) {
        const options = {
          enableHighAccuracy: true,
        };
        const success = (position) => {
          setFormData({
            ...formData,
            geolocation: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            },
          });
        };
        const error = (error) => {
          console.error(error);
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        setFormData({
          ...formData,
          geolocation: "",
        });
      }
    } else if (name === "media") {
      const temp = formData.media;
      temp.push(value);
      setFormData({
        ...formData,
        media: temp,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  return (
    <form className="create-echo-form" onSubmit={createEcho}>
      <label htmlFor="echoName">Echo Name:</label>
      <input
        type="text"
        name="echoName"
        value={formData.echoName}
        onChange={handleChange}
      />
      <label htmlFor="media">Select Media: </label>
      <input
        type="file"
        name="media"
        onChange={handleChange}
        multiple
        value={formData.media}
      />
      <label htmlFor="description">Description:</label>
      <textarea
        name="description"
        id="description"
        onChange={handleChange}
        value={formData.description}
      ></textarea>
      <EchoMakerTagsInput
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
      />
      <label htmlFor="anonymous">
        <input
          type="checkbox"
          name="anonymous"
          onChange={handleChange}
          checked={formData.anonymous}
        />
        Post anonymously
      </label>
      <label htmlFor="geolocation">
        <input
          type="checkbox"
          name="geolocation"
          onChange={handleChange}
          value={formData.geolocation}
          checked={formData.geolocation}
        />
        Pin on my location
      </label>
      {formData.geolocation && (
        <p>
          Latitude: {formData.geolocation.latitude}, Longitude:{" "}
          {formData.geolocation.longitude}
        </p>
      )}
      <label htmlFor="unlock_datetime">Unlock Time:</label>
      <input
        type="datetime-local"
        name="unlock_datetime"
        onChange={handleChange}
        value={formData.unlock_datetime}
      />
      <EchoMakerTypeInput formData={formData} handleChange={handleChange} />
      {Object.values(errors).map((error, index) => (
        <p key={error + index}>{error}</p>
      ))}
      <button type="submit">Create Echo</button>
    </form>
  );
}
