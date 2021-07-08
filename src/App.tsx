import React from "react";
import "./App.css";
import { Row, Col, PageHeader, Card } from "antd";
import useVolOracles, { ORACLE_METADATA, Pools } from "./hooks/useVolOracles";
import { formatUnits } from "@ethersproject/units";

function App() {
  const oracles = useVolOracles();

  return (
    <div>
      <PageHeader
        className="site-page-header-responsive"
        title="RVOL"
      ></PageHeader>
      <div style={{ marginTop: 30 }}>
        <Row>
          <Col offset={1} span={5}>
            <h1>Volatility feeds</h1>
          </Col>
        </Row>

        <Row>
          <Col offset={1}></Col>

          {Object.values(oracles).map((oracle, index) => {
            const pools = Object.keys(oracles) as Pools[];
            const { decimals, name, quoteAsset, icon } =
              ORACLE_METADATA[pools[index]];

            return (
              <Col span={5}>
                <Card
                  title={name}
                  style={{ width: "90%" }}
                  extra={
                    <img style={{ width: 30 }} src={icon} alt={name}></img>
                  }
                >
                  <div>
                    Historical volatility (annualized):{" "}
                    {(
                      parseFloat(formatUnits(oracle.annualizedVol, 8)) * 100
                    ).toFixed(2)}
                    %
                  </div>
                  <div>
                    Last TWAP:{" "}
                    {parseFloat(formatUnits(oracle.lastTWAP, decimals)).toFixed(
                      6
                    )}{" "}
                    {quoteAsset}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default App;
