import React from "react";

export default function EchoMakerTagsInput({
  formData,
  setFormData,
  handleChange,
}) {
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
  function removeTag(event) {
    const tag = event.target.textContent;
    const temp = formData.tags.filter((t) => t !== tag);
    setFormData({
      ...formData,
      tags: temp,
    });
  }
  return (
    <div>
      <label htmlFor="tags">Tags:</label>
      <select name="tags" onChange={handleChange}>
        {tags.map((tag, index) => (
          <option
            key={index}
            value={tag}
            disabled={formData.tags.includes(tag)}
          >
            {tag}
          </option>
        ))}
      </select>
      <ul className="list-of-tags">
        {formData.tags.map((tag, index) => (
          <li key={tag + index} onClick={removeTag}>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}
