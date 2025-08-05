import React from "react";

export default function EchoMakerTypeInput({ formData, handleChange }) {
  const MOCK_USERS = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];
  return (
    <>
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
    </>
  );
}
