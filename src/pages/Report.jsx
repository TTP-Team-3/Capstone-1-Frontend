import React, { useState } from "react";
import "./Report.css";
import { useParams } from "react-router-dom";

export default function Report() {
  const [formData, setFormData] = useState({
    reasons: {},
    "additional-comments": "",
  });
  const params = useParams();
  const reportOptions = [
    "Wrong Tags",
    "Hate Speech",
    "Personal Information",
    "Threats of Violence/Terrorism",
    "Breaks TOS",
    "Other",
  ];

  function handleChange(event) {
    const { name, value, checked } = event.target;
    if (name.startsWith("report-reason")) {
      setFormData({
        ...formData,
        reasons: {
          ...formData.reasons,
          [value]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  function submitReport(event) {
    event.preventDefault();
    const reportData = {
      echo_id: params.id,
      additionalComments: formData["additional-comments"],
      reasons: Object.keys(formData.reasons).filter(
        (key) => formData.reasons[key] === true,
      ),
    };
    console.log(reportData);
  }

  return (
    <form className="report-container" onSubmit={submitReport}>
      <h1 className="report-id">Echo ID: {params.id}</h1>
      <ol className="report-list">
        {reportOptions.map((option, index) => (
          <li key={index}>
            <input
              type="checkbox"
              name={`report-reason-${index}`}
              value={option}
              checked={formData.reasons[option] || false}
              onChange={handleChange}
            />
            <label htmlFor={`report-reason-${index}`}>{option}</label>
          </li>
        ))}
      </ol>
      <textarea
        name="additional-comments"
        id="additional-comments"
        placeholder="Additional Comments"
        onChange={handleChange}
      ></textarea>

      <button type="submit">Submit</button>
    </form>
  );
}
