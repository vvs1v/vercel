import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarChart = ({ data, xAxis, yAxis }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;

    if (chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy(); // Destroy the previous chart instance
      }

      const ctx = chartRef.current.getContext("2d");

      const xValues = data.rows.map((row) => row[data.headers.indexOf(xAxis)]);
      const yValues = data.rows.map((row) => row[data.headers.indexOf(yAxis)]);

      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [
            {
              label: yAxis,
              data: yValues,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy(); // Cleanup chart instance on component unmount
      }
    };
  }, [data, xAxis, yAxis]);

  return (
    <div>
      {/* <h2>Bar Chart</h2> */}
      <div style={{ width: "500px", height: "400px" }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default BarChart;
