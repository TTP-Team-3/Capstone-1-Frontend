import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EchoMaker.css";

export default function EchoMaker({ user }) {
  const [formData, setFormData] = useState({
    echoName: "",
    media: "",
    description: "",
    tags: [],
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

  const tags = [
    "Mood",
    "Feeling good",
    "Bad day",
    "Reflection",
    "For later",
    "Note to self",
    "Motivation",
    "You and me",
    "Just us",
    "Missing you",
    "Secret",
  ];
  function createEcho(event) {
    event.preventDefault();

    console.log(formData);
  }

  function removeTag(event) {
    const tag = event.target.textContent.toLowerCase();
    const temp = formData.tags.filter((t) => t !== tag);
    setFormData({
      ...formData,
      tags: temp,
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
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
      <div>
        <label htmlFor="tags">Tags:</label>
        <select name="tags" onChange={handleChange}>
          {tags.map((tag, index) => (
            <option
              key={index}
              value={tag.toLowerCase()}
              disabled={formData.tags.includes(tag.toLowerCase())}
            >
              {tag}
            </option>
          ))}
        </select>
        <ul className="list-of-tags">
          {formData.tags.map((tag, index) => (
            <li key={tag + index} onClick={removeTag}>
              {tag
                .split(" ")
                .map((word, index) =>
                  index == 0 ? word[0].toUpperCase() + word.substring(1) : word,
                )
                .join(" ")}
            </li>
          ))}
        </ul>
      </div>
      <label htmlFor="anonymous">
        <input
          type="checkbox"
          name="anonymous"
          onChange={handleChange}
          checked={formData.anonymous}
        />
        Anonymous
      </label>
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
