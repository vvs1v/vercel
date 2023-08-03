import React from "react";

const LoadingProgressBar = () => {
  return (
    <div className="progress mt-4">
      <div
        className="progress-bar progress-bar-striped progress-bar-animated custom-progress-bar"
        role="progressbar"
        style={{ backgroundColor: "rgb(255, 115, 0)", width: "100%" }}
      >
        Generating Query & Detailed View...
      </div>
    </div>
  );
};

export default LoadingProgressBar;
