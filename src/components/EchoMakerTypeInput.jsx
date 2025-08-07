import React from "react";

export default function EchoMakerTypeInput({
  formData,
  setFormData,
  handleChange,
}) {
  const MOCK_USERS = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  function removeFriend(event) {
    event.preventDefault();
    const friendName = event.target.textContent;
    const friendId = MOCK_USERS.find((user) => user.name === friendName).id;
    const temp = formData.friendIds.filter((id) => id !== friendId);
    setFormData({
      ...formData,
      friendIds: temp,
    });
  }
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
          <>
            <select name="friendIds" onChange={handleChange}>
              {MOCK_USERS.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                  disabled={formData.friendIds.includes(Number(user.id))}
                >
                  {user.name}
                </option>
              ))}
            </select>
            <ul className="list-of-friends">
              {formData.friendIds.map((friendId, index) => (
                <li key={friendId} onClick={removeFriend}>
                  {MOCK_USERS.find((user) => user.id === friendId).name}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
