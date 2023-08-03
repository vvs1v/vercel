import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "./Home.css";
import Logo from "../assets/img/logo.png";

import BarChart from "./Charts/BarChart";
import LineChart from "./Charts/LineChart";
import PieChart from "./Charts/PieChart";
// import TextInput from "./TextInput";
import LoadingProgressBar from "./LoadingProgressBar";
import GeneratedQuery from "./GeneratedQuery";
import DetailedView from "./DetailedView";
import AxisSelect from "./AxisSelect";
import Visualization from "./Visualization";

function Home() {
  const [data, setData] = useState({
    text: "",
    query: "",
    dummyData: null,
    isLoading: false,
  });
  const [chartData, setChartData] = useState(null);
  const [isChartDataValid, setIsChartDataValid] = useState(true);
  const [selectedChart, setSelectedChart] = useState("");
  const [selectedXAxis, setSelectedXAxis] = useState("");
  const [selectedYAxis, setSelectedYAxis] = useState("");
  const [statement, setStatement] = useState("");

  const handleTextChange = (event) => {
    setData({ ...data, text: event.target.value });
  };

  const handleChartSelect = (event) => {
    setSelectedChart(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const { text } = data;

    setData({ ...data, isLoading: true });

    // Simulating loading time
    setTimeout(() => {
      let query = "";
      let dummyData = null;

      // Hardcoded mappings for the texts, queries, and dummy data
      switch (text) {
        case "Give me customer details from France":
          query = "SELECT * FROM customer_data WHERE country = 'France'";
          dummyData = {
            headers: ["Customer ID", "Name", "Age", "Country"],
            rows: [
              ["1", "John Doe", "35", "France"],
              ["2", "Jane Smith", "28", "France"],
              ["3", "Michael Johnson", "42", "France"],
            ],
          };
          break;
        case "Give me the count of orders placed in each country":
          query =
            "SELECT Cntry, COUNT(OrderID) AS Order_Count FROM Customer c JOIN Orders o ON c.CustomerID = o.CustID GROUP BY Cntry;";
          dummyData = {
            headers: ["Country", "Order Count"],
            rows: [
              ["France", 10],
              ["Germany", 15],
              ["United States", 25],
            ],
          };
          break;
        case "Show me the total sales by product category.":
          query =
            "SELECT category, SUM(sales) AS total_sales FROM sales_table GROUP BY category;";
          dummyData = {
            headers: ["Category", "Total Sales"],
            rows: [
              ["Electronics", 5000],
              ["Clothing", 3000],
              ["Home & Kitchen", 2000],
            ],
          };
          break;
        case "Display the average rating of products in each department.":
          query =
            "SELECT department, AVG(rating) AS average_rating FROM products_table GROUP BY department;";
          dummyData = {
            headers: ["Department", "Average Rating"],
            rows: [
              ["Electronics", 4.5],
              ["Clothing", 4.2],
              ["Home & Kitchen", 4.0],
            ],
          };
          break;
        case "Give me the population of France.":
          query = "SELECT population FROM country_table;";
          dummyData = {
            headers: ["Population"],
            rows: [[1789678]],
          };
          break;
        case "Provide the total inventory count for each product in stock.":
          query =
            "SELECT product_name, SUM(quantity) AS total_inventory FROM inventory_table GROUP BY product_name;";
          dummyData = {
            headers: ["Product", "Total Inventory"],
            rows: [
              ["Phone", 100],
              ["Laptop", 50],
              ["TV", 30],
            ],
          };
          break;
        default:
          query = "";
          dummyData = null;
          break;
      }

      if (
        // if only single cell is returned, then display it in the statement format
        dummyData &&
        dummyData.rows.length === 1 &&
        dummyData.headers.length === 1
      ) {
        const value = dummyData.rows[0][0];
        setStatement(`The value is ${value}.`);
      } else {
        setStatement(""); // Reset the statement if it's not applicable
      }

      setChartData(dummyData);
      const isChartDataValid = validateChartData(dummyData);
      setData({ ...data, query, dummyData, isLoading: false });
      setIsChartDataValid(isChartDataValid);
    }, 3000);
  };

  const validateChartData = (dummyData) => {
    if (!dummyData) {
      return false;
    }

    if (!dummyData.rows || dummyData.rows.length === 0) {
      return false;
    }

    // the data should have atleast 2 columns else visualization is not possible
    const firstRow = dummyData.rows[0];
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
      if (data.dummyData.headers.length === 2) {
        const xAxis = data.dummyData.headers[0];
        const yAxis = data.dummyData.headers[1];

        return (
          <div className="mt-4">
            {selectedChart === "bar" && (
              <BarChart data={chartData} xAxis={xAxis} yAxis={yAxis} />
            )}
            {selectedChart === "line" && (
              <LineChart data={chartData} xAxis={xAxis} yAxis={yAxis} />
            )}
            {selectedChart === "pie" && (
              <PieChart data={chartData} xAxis={xAxis} yAxis={yAxis} />
            )}
          </div>
        );
      } else {
        const xIndex = data.dummyData.headers.indexOf(selectedXAxis);
        const yIndex = data.dummyData.headers.indexOf(selectedYAxis);
        const isXAxisValid =
          xIndex !== -1 &&
          data.dummyData.rows.every((row) => row[xIndex] !== undefined);
        const isYAxisValid =
          yIndex !== -1 &&
          data.dummyData.rows.every((row) => {
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
                Bring Your Own Data and  <br /> Discover
              </h1>
              <p className="lead text-white ms-5">
                “the future of BI is Conversational”
              </p>
              <br />
            </Col>
            <Col md={4}>
              <Form onSubmit={handleSubmit} id="myForm">
                <Form.Group className="mb-3 ms-2">
                  <Form.Label className="text-white">
                    Ask something about your data
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={data.text}
                    onChange={handleTextChange}
                    placeholder="Give me customer details from France"
                  />
                </Form.Group>
                {data.isLoading ? (
                  <LoadingProgressBar />
                ) : (
                  data.query && <GeneratedQuery query={data.query} />
                )}
              </Form>
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <Button
                type="submit"
                variant="primary"
                disabled={data.isLoading}
                className={`mt-3 circular-button ms-5 ${
                  data.isLoading ? "loading" : ""
                }`}
                form="myForm"
              >
                {data.isLoading ? "Generating Query..." : "Generate \n Results"}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="lower-section">
        <Container fluid className="mt-5">
          <Row>
            <Col lg={2} className="border-right">
              {!data.isLoading && data.dummyData && statement === "" && (
                <div className="mt-4">
                  {data.dummyData.headers.length === 2 ? (
                    <>
                      <AxisSelect
                        label="X-axis"
                        options={data.dummyData.headers}
                        value={selectedXAxis}
                        onChange={(event) =>
                          setSelectedXAxis(event.target.value)
                        }
                      />
                      <AxisSelect
                        label="Y-axis"
                        options={data.dummyData.headers}
                        value={selectedYAxis}
                        onChange={(event) =>
                          setSelectedYAxis(event.target.value)
                        }
                      />
                    </>
                  ) : (
                    <>
                      <AxisSelect
                        label="X-axis"
                        options={data.dummyData.headers}
                        value={selectedXAxis}
                        onChange={(event) =>
                          setSelectedXAxis(event.target.value)
                        }
                      />
                      <AxisSelect
                        label="Y-axis"
                        options={data.dummyData.headers}
                        value={selectedYAxis}
                        onChange={(event) =>
                          setSelectedYAxis(event.target.value)
                        }
                      />
                    </>
                  )}
                  {!data.isLoading && data.dummyData && statement === "" && (
                    <>
                      <Visualization
                        selectedChart={selectedChart}
                        handleChartSelect={handleChartSelect}
                        renderChart={renderChart}
                      />
                    </>
                  )}

                  {!isChartDataValid && (
                    <div className="mt-4">
                      <h2>No chart available for this data.</h2>
                    </div>
                  )}
                </div>
              )}
              <div className="d-flex justify-content-center">
                <Button block className="mt-3 custom-button">
                  Download Data
                </Button>
              </div>
            </Col>
            <Col className="d-flex flex-column">
              {/* Second Column */}
              <h4 className="text-center">
                <span className="heading">10,000</span>
                <br />
                total orders
              </h4>
              {data.dummyData && statement === "" && (
                <DetailedView
                  headers={data.dummyData.headers}
                  rows={data.dummyData.rows}
                />
              )}
            </Col>
            <Col>
              {/* Third Column */}
              {!data.isLoading && data.dummyData && statement === "" && (
                <>
                  <Visualization
                    selectedChart={selectedChart}
                    handleChartSelect={handleChartSelect}
                    renderChart={renderChart}
                  />
                </>
              )}

              {!isChartDataValid && (
                <div className="mt-4">
                  <h2>No chart available for this data.</h2>
                </div>
              )}
              {renderChart()}
            </Col>
            <Col>
              {!data.isLoading && data.dummyData && statement === "" && (
                <>
                  <Visualization
                    selectedChart={selectedChart}
                    handleChartSelect={handleChartSelect}
                    renderChart={renderChart}
                  />
                </>
              )}

              {!isChartDataValid && (
                <div className="mt-4">
                  <h2>No chart available for this data.</h2>
                </div>
              )}
              {renderChart()}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Home;
