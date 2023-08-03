import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ data, xAxis, yAxis }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;

    if (chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      const xValues = data.rows.map((row) => row[data.headers.indexOf(xAxis)]);
      const yValues = data.rows.map((row) => row[data.headers.indexOf(yAxis)]);

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: xValues,
          datasets: [
            {
              label: yAxis,
              data: yValues,
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: false,
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
        chartInstance.destroy();
      }
    };
  }, [data, xAxis, yAxis]);

  return (
    <div>
      {/* <h2>Line Chart</h2> */}
      <div style={{ width: "500px", height: "500px" }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default LineChart;
