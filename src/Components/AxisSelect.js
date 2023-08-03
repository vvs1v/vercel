// AxisSelect.js

import React from "react";

const AxisSelect = ({ label, options, value, onChange }) => {
  // const isDisabled = options.length === 2; // Check if there are only two options

  // // Prepopulate the select values if only two options are available and no values are selected
  let selectXValue = value;
  let selectYValue = value;
  // if (isDisabled && !value) {
  //   selectXValue = options[0];
  //   selectYValue = options[1];
  // }

  return (
    <div className="mb-3">
      <label htmlFor={`${label}Select`} className="form-label">
        Select {label}:
      </label>
      <select
        id={`${label}Select`}
        className="form-select"
        value={label === "X-axis" ? selectXValue : selectYValue}
        onChange={onChange}
        // disabled={isDisabled} // Disable the select when there are only two options
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AxisSelect;
