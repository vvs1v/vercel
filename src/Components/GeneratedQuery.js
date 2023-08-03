// GeneratedQuery.js

import React from "react";

const GeneratedQuery = ({ query }) => {
  return (
    <div className="mt-4 generated-query-box mb-4">
      <h5 className="text-white">Generated backend SQL query:</h5>
      <p className="lead text-white">{query}</p>
    </div>
  );
};

export default GeneratedQuery;
