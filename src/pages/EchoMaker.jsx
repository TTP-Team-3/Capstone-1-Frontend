import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EchoMaker.css";
import EchoMakerTagsInput from "../components/EchoMakerTagsInput";

export default function EchoMaker({ user }) {
  const [formData, setFormData] = useState({
    echoName: "",
    media: "",
    description: "",
    tags: [],
    anonymous: false,
    unlock_datetime: "",
    type: "",
    friends: [],
    geolocation: "",
  });
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/");
  //   }
  // }, []);

  const MOCK_USERS = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  function createEcho(event) {
    event.preventDefault();

    console.log(formData);
  }

  function handleChange(event) {
    const { checked, name, value } = event.target;
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
      <label htmlFor="media">Add media:</label>
      <input
        type="file"
        name="media"
        value={formData.media}
        onChange={handleChange}
        multiple
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
        Post with geolocation
      </label>
      {formData.geolocation && (
        <p>
          {formData.geolocation.latitude}, {formData.geolocation.longitude}
        </p>
      )}
      <label htmlFor="unlock_datetime">Unlock Time:</label>
      <input
        type="datetime-local"
        name="unlock_datetime"
        onChange={handleChange}
        value={formData.unlock_datetime}
      />
      <label htmlFor="type">Type:</label>
      <div>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="">--Choose Type--</option>
          <option value="public">Public</option>
          <option value="friends">Friends</option>
          <option value="private">Private</option>
        </select>
        {formData.type === "friends" && (
          <select name="friends" onChange={handleChange}>
            {MOCK_USERS.map((user) => (
              <option
                key={user.id}
                value={user.id}
                disabled={formData.friends.includes(Number(user.id))}
              >
                {user.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <button type="submit">Create Echo</button>
    </form>
  );
}
