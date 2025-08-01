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
    unlockTime: null,
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

    console.log(event.target);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    console.log({ name, value });
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  }

  return (
    <form className="create-echo-form" onSubmit={createEcho}>
      <input
        type="text"
        name="echoName"
        value={formData.echoName}
        onChange={handleChange}
        placeholder="Echo Name"
      />
      <input
        type="file"
        name="media"
        value={formData.media}
        onChange={handleChange}
        multiple
      />
      <textarea name="description" id="description"></textarea>
      <input type="text" name="tags" />
      <button type="submit">Create Echo</button>
    </form>
  );
}
