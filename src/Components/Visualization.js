// Visualization.js

import React from "react";

const Visualization = ({ selectedChart, handleChartSelect }) => {
  return (
    <>
      <div className="m-5 mt-3 mb-4">
        <p className="mb-1">Select Visualization:</p>
        <select
          className="form-select"
          value={selectedChart}
          onChange={handleChartSelect}
          // disabled={!selectedXAxis || !selectedYAxis}
        >
          <option value="">Select Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      {/* {renderChart()} */}
    </>
  );
};

export default Visualization;
