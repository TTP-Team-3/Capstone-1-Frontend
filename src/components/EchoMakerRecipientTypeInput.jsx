import React from "react";

export default function EchoMakerRecipientTypeInput({
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
    const userName = event.target.textContent;
    const userId = MOCK_USERS.find((user) => user.name === userName).id;
    const temp = formData.customRecipients.filter((id) => id !== userId);
    setFormData({
      ...formData,
      customRecipients: temp,
    });
  }
  return (
    <>
      <label htmlFor="recipient_type">Recipient Type:</label>
      <div>
        <select
          name="recipient_type"
          value={formData.recipient_type}
          onChange={handleChange}
        >
          <option value="">--Choose Type--</option>
          <option value="public">Public</option>
          <option value="friend">Friends</option>
          <option value="self">Self</option>
          <option value="custom">Custom</option>
        </select>
        {formData.recipient_type === "custom" && (
          <>
            <select name="customRecipients" onChange={handleChange}>
              {MOCK_USERS.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                  disabled={formData.customRecipients.includes(Number(user.id))}
                >
                  {user.name}
                </option>
              ))}
            </select>
            <ul className="list-of-friends">
              {formData.customRecipients.map((userId, index) => (
                <li key={userId} onClick={removeFriend}>
                  {MOCK_USERS.find((user) => user.id === userId).name}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
