import React, { useState } from "react";
import "./Report.css";
import { useParams } from "react-router-dom";

export default function Report() {
  // There might need to be a GET request here to validate the echo id even exists initially, but probably not a priority for now
  const [formData, setFormData] = useState({
    reasons: {},
    "additional-comments": "",
  });
  const [errors, setErrors] = useState({ reasons: "" });
  const params = useParams();
  const reportOptions = [
    "Wrong tags",
    "Hate speech",
    "Personal information",
    "Threats of violence/Terrorism",
    "Breaks TOS",
    "Other",
  ];

  function handleChange(event) {
    setErrors({ reasons: "" });
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
    if (
      !formData.reasons ||
      Object.keys(formData.reasons).every((key) => !formData.reasons[key])
    ) {
      setErrors({ ...errors, reasons: "You must include at least 1 reason!" });
      return;
    } else if (formData.reasons["Other"] && !formData["additional-comments"]) {
      setErrors({
        ...errors,
        other: 'Additional comments required for "Other"!',
      });
      return;
    }
    const reportData = {
      echo_id: params.id,
      additionalComments: formData["additional-comments"],
      reasons: Object.keys(formData.reasons).filter(
        (key) => formData.reasons[key] === true,
      ),
    };
    console.log(reportData);
    // Instead of logging should be a POST request here when ready
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
        placeholder={
          !formData.reasons["Other"]
            ? "Additional Comments(optional)"
            : "Additional Comments Required"
        }
        onChange={handleChange}
      ></textarea>
      <div className="errors" hidden={!errors.reasons && !errors.other}>
        {errors.reasons || errors.other}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
