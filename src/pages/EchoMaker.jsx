import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EchoMaker.css";

export default function EchoMaker({ user }) {
  const [formData, setFormData] = useState({
    echoName: "",
    media: "",
    description: "",
    tags: "",
    anonymous: false,
    unlock_datetime: "",
    type: "",
  });
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/");
  //   }
  // }, []);

  function createEcho(event) {
    event.preventDefault();

    console.log(formData);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "anonymous") {
      setFormData({
        ...formData,
        [name]: !formData.anonymous,
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
      <label htmlFor="tags">Tags:</label>
      <input
        type="text"
        name="tags"
        onChange={handleChange}
        value={formData.tags}
      />
      <label htmlFor="anonymous">Anonymous:</label>
      <input
        type="checkbox"
        name="anonymous"
        onChange={handleChange}
        checked={formData.anonymous}
      />
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
        <select name="friends" value={formData.friends}></select>
      </div>
      <button type="submit">Create Echo</button>
    </form>
  );
}
