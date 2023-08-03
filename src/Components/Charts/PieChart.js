import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ data, xAxis, yAxis }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;

    if (chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      const labels = data.rows.map((row) => row[data.headers.indexOf(xAxis)]);
      const values = data.rows.map((row) => row[data.headers.indexOf(yAxis)]);

      chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(192, 75, 192, 0.6)",
                "rgba(192, 192, 75, 0.6)",
                "rgba(255, 0, 0, 0.6)",
                "rgba(0, 255, 0, 0.6)",
                "rgba(0, 0, 255, 0.6)",
                "rgba(255, 255, 0, 0.6)",
                "rgba(255, 0, 255, 0.6)",
                "rgba(0, 255, 255, 0.6)",
                "rgba(128, 0, 0, 0.6)",
                "rgba(0, 128, 0, 0.6)",
                "rgba(0, 0, 128, 0.6)",
                "rgba(128, 128, 0, 0.6)",
                "rgba(128, 0, 128, 0.6)",
                "rgba(0, 128, 128, 0.6)",
                "rgba(128, 128, 128, 0.6)",
                "rgba(255, 165, 0, 0.6)",
                "rgba(255, 0, 165, 0.6)",
                "rgba(165, 255, 0, 0.6)",
                "rgba(0, 255, 165, 0.6)",
              ],
            },
          ],
        },
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data, xAxis, yAxis]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        // alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        {/* <h2>Pie Chart</h2> */}
        <div style={{ width: "300px", height: "300px" }}>
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
