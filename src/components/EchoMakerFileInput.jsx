import React from "react";

export default function EchoMakerFileInput({
  formData,
  setFormData,
  handleChange,
}) {
  function removeFile(event) {
    event.preventDefault();
    const { value } = event.target;

    let currentFiles = formData.media;
    currentFiles = currentFiles.filter((file) => file.name !== value);
    setFormData({
      ...formData,
      media: currentFiles,
    });
  }
  return (
    <>
      <input
        type="file"
        className="echo-media-input"
        name="media"
        id="media"
        onChange={handleChange}
        multiple
      />
      {formData.media.length !== 0 ? (
        <ol className="echo-media-list">
          {formData.media.map((file) => (
            <li className="echo-media-file" key={file.name + file.size}>
              <button
                className="remove-file-button"
                value={file.name}
                onClick={removeFile}
              >
                X
              </button>
              {file.name}
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );
}
