import React from "react";

const DetailedView = ({ headers, rows }) => {
  return (
    <div className="m-5 mt-2">
      {/* <h2>Detailed View:</h2> */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedView;
