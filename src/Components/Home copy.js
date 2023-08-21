import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "./Home.css";
import Logo from "../assets/img/logo.png";
import axios from "axios";

import BarChart from "./Charts/BarChart";
import LineChart from "./Charts/LineChart";
import PieChart from "./Charts/PieChart";
import LoadingProgressBar from "./LoadingProgressBar";
import GeneratedQuery from "./GeneratedQuery";
import DetailedView from "./DetailedView";
import AxisSelect from "./AxisSelect";
import Visualization from "./Visualization";

function Home() {
  const [chartData, setChartData] = useState(null);
  const [isChartDataValid, setIsChartDataValid] = useState(true);
  const [selectedChart, setSelectedChart] = useState("");
  const [selectedXAxis, setSelectedXAxis] = useState("");
  const [selectedYAxis, setSelectedYAxis] = useState("");
  const [statement, setStatement] = useState("");

  // Data state in which we'll store the data in the required format
  const [data, setData] = useState({
    headers: [],
    rows: [],
    message: "",
    sqlQuery: "",
    isLoading: false,
    flag: false,
  });
  // Query text given from the frontend textbox is stored in this input state
  const [input, setInput] = useState("");

  const defaultValues = new Set([
    "raw_text",
    "status",
    "Success_Message",
    "SQL_Query_Generated",
    "Record_Count",
    "Column_Count",
    "Flag_Tabular"
  ]);

  async function callAPI() {
    setData({ ...data, isLoading: true });
    setSelectedChart("");
    // Calling Flask API and returning data to res
    const res = await (
      await axios.post("http://127.0.0.1:5000/out", {
        user_input: input,
      })
    ).data;

    // Uncomment to see response object
    console.log(res);

    // Initializing headers, rows, message and sql query.
    let headers = [];
    let rows = [];
    let message = "";
    let sqlQuery = "";
    let flag = false;

    // Iterating through keys of res, and appending them to headers array.
    // Keys present in defaultValues aren't appended.
    for (let key in res) {
      if (!defaultValues.has(key)) {
        headers.push(key);
      }
    }

    // Setting the data state corresponding to different response scenarios
    if (headers.includes("Error_Message")) {
      headers.pop();
      message = res["Error_Message"];
    } else if (headers.length === 0) {
      message = res["Success_Message"];
      sqlQuery = res["SQL_Query_Generated"];
    } else {
      for (let i = 0; i < res[headers[0]].length; i++) {
        let temp = [];
        for (let header of headers) {
          temp.push(res[header][i]);
        }
        rows.push(temp);
      }
      message = res["Success_Message"];
      sqlQuery = res["SQL_Query_Generated"];
      flag = res["Flag_Tabular"];
    }

    setData({
      headers: headers,
      rows: rows,
      message: message,
      sqlQuery: sqlQuery,
      isLoading: false,
      flag
    });

    if (data && data.rows.length === 1 && data.headers.length === 1) {
      const value = data.rows[0][0];
      setStatement(`The value is ${value}.`);
    } else {
      setStatement(""); // Reset the statement if it's not applicable
    }
  }

  useEffect(() => {
    if (data) {
      setChartData(data);
      const isChartDataValid = validateChartData(data);
      setIsChartDataValid(isChartDataValid);
    }
  }, [data]);

  const handleDownload = () => {
    axios({
      url: "http://127.0.0.1:5000/download",
      method: "GET",
      responseType: "blob", // Set the response type to 'blob' for file download
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.xlsx"); // Set the desired file name
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error occurred during file download:", error);
      });
  };

  const handleTextChange = (event) => {
    setInput(event.target.value);
  };

  const handleChartSelect = (event) => {
    setSelectedChart(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    callAPI();
    setChartData(null);
  };

  const validateChartData = (data) => {
    if (!data) {
      return false;
    }

    if (!data.rows || data.rows.length === 0) {
      return false;
    }

    // the data should have atleast 2 columns else visualization is not possible
    const firstRow = data.rows[0];
    if (firstRow.length < 2) {
      return false;
    }

    // Validate if the second column of the rows contains numerical or string values
    const secondColumn = firstRow[1];
    if (!isNumericColumn(secondColumn) && !isStringColumn(secondColumn)) {
      return false;
    }
    return true;
  };

  const isStringColumn = (column) => {
    return typeof column === "string";
  };

  const isNumericColumn = (column) => {
    // Using the Number() function to convert the value to a number
    const numericValue = Number(column);
    return !isNaN(numericValue);
  };

  const renderChart = () => {
    if (isChartDataValid && chartData && selectedChart !== "") {
      const xIndex = data.headers.indexOf(selectedXAxis);
      const yIndex = data.headers.indexOf(selectedYAxis);
      const isXAxisValid =
        xIndex !== -1 && data.rows.every((row) => row[xIndex] !== undefined);
      const isYAxisValid =
        yIndex !== -1 &&
        data.rows.every((row) => {
          const value = row[yIndex];
          return (
            value !== undefined &&
            (!isStringColumn(value) || isNumericColumn(value))
          );
        });

      if (isXAxisValid && isYAxisValid) {
        switch (selectedChart) {
          case "bar":
            return (
              <div className="mt-4">
                <BarChart
                  data={chartData}
                  xAxis={selectedXAxis}
                  yAxis={selectedYAxis}
                />
              </div>
            );
          case "line":
            return (
              <div className="mt-4">
                <LineChart
                  data={chartData}
                  xAxis={selectedXAxis}
                  yAxis={selectedYAxis}
                />
              </div>
            );
          case "pie":
            return (
              <div className="mt-4">
                <PieChart
                  data={chartData}
                  xAxis={selectedXAxis}
                  yAxis={selectedYAxis}
                />
              </div>
            );
          default:
            return null;
        }
      } else {
        return (
          <div className="mt-4">
            <h2>Invalid X or Y Axis</h2>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <div className="home">
      <div className="upper-section">
        <Container fluid>
          <Row className="h-50">
            <Col md={12} className="d-flex align-items-center">
              <div className="logo">
                <img src={Logo} alt="logo" />
              </div>
            </Col>
          </Row>
          <Row className="first-row">
            <Col
              md={4}
              //   className="d-flex flex-column align-items-center"
            >
              <h1 className="text-white fw-bold header ms-5">
                Analyze Your Service Now <br /> Tickets
              </h1>
              <p className="lead text-white ms-5">
                “the future of BI is Conversational”
              </p>
              <br />
            </Col>
            <Col md={5}>
              <Form onSubmit={handleSubmit} id="myForm">
                <Form.Group className="mb-2 ms-2 mt-5">
                  <Form.Control
                    type="text"
                    value={input}
                    onChange={handleTextChange}
                    placeholder="Ask something about your data..."
                  />
                </Form.Group>
                {data.isLoading ? (
                  <LoadingProgressBar />
                ) : (
                  data.sqlQuery && <GeneratedQuery query={data.sqlQuery} />
                )}
              </Form>
            </Col>
            <Col md={3}>
              <Button
                type="submit"
                variant="danger"
                disabled={data.isLoading}
                className={`circular-button ms-5 ${
                  data.isLoading ? "loading" : ""
                }`}
                form="myForm"
              >
                {data.isLoading ? (
                  <span>
                    Generating Query...
                    <span className="loading-spinner">&#x21BB;</span>
                  </span>
                ) : (
                  "Generate \n Results"
                )}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="lower-section">
        <Container fluid className="mt-5">
          <Row>
            <Col className="ms-4" lg={2}>
              {/* className="border-right" */}
              {!data.isLoading &&
                data.headers.length > 1 &&
                statement === "" && (
                  <div className="mt-4">
                    {data.headers.length > 1 && (
                      <>
                        <AxisSelect
                          label="X-axis"
                          options={data.headers}
                          value={selectedXAxis}
                          onChange={(event) =>
                            setSelectedXAxis(event.target.value)
                          }
                        />
                        <AxisSelect
                          label="Y-axis"
                          options={data.headers}
                          value={selectedYAxis}
                          onChange={(event) =>
                            setSelectedYAxis(event.target.value)
                          }
                        />
                      </>
                    )}
                    {!data.isLoading && data && statement === "" && data.flag && (
                      <>
                        <Button
                          className="mt-2 custom-button"
                          onClick={handleDownload}
                        >
                          Download Data
                        </Button>
                      </>
                    )}

                    {!isChartDataValid && !data.isLoading && (
                      <div className="mt-4">
                        <h2>No chart available for this data.</h2>
                      </div>
                    )}
                  </div>
                )}
              <div className="d-flex justify-content-center"></div>
            </Col>
            <Col className="d-flex flex-column">
              {/* Second Column */}
              <h6 className="text-uppercase heading ms-5">
                {data && !data.isLoading && <div>{data.message}</div>}
              </h6>
              {!data.isLoading && data && statement === "" && (
                <DetailedView headers={data.headers} rows={data.rows} />
              )}
            </Col>
            <Col>
              {/* Third Column */}
              {!data.isLoading &&
                statement === "" &&
                data.headers.length > 1 && (
                  <>
                    <Visualization
                      selectedChart={selectedChart}
                      handleChartSelect={handleChartSelect}
                      renderChart={renderChart}
                    />
                  </>
                )}

              {!isChartDataValid &&
                data.headers.length > 1 &&
                !data.isLoading && (
                  <div className="mt-4">
                    <h2>No chart available for this data.</h2>
                  </div>
                )}
              {!data.isLoading && renderChart()}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Home;
