import React, { useState } from "react";

export default function FileUpload({ handleChange }) {
  return (
    <div>
      <label htmlFor="media">Select Media: </label>
      <input type="file" name="media" onChange={handleChange} multiple />
    </div>
  );
}
