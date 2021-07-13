import React, { useCallback, useState } from "react";
import { BigNumber, ethers } from "ethers";
import moment from "moment";
import { Row, Col, Button, Select, Radio, Form, DatePicker, Input } from "antd";
import { ORACLE_METADATA, Pools, pools } from "../hooks/useVolOracles";
import useProvider from "../hooks/useProvider";
import OptionsPremiumPricerABI from "../abis/OptionsPremiumPricer.json";
import { formatUnits } from "@ethersproject/units";

const { Option } = Select;

const PRICERS_BY_POOL: { [pool in Pools]: string } = {
  // ETH USDC pool
  "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8":
    "0x16Bc6DECA21B28D45233393553A9bf31792aE23C",
  "0x99ac8cA7087fA4A2A1FB6357269965A2014ABc35":
    "0x2843bD3BF280Aa37Cc3a7d6a85B6d8f2F23a7b83",
};

const OptionsPricer = () => {
  const [pool, setPool] = useState<Pools>(pools[0]);
  const [expiry, setExpiry] = useState(moment().add(1, "weeks"));
  const [strike, setStrike] = useState("");
  const [isPut, setIsPut] = useState(false);
  const [premium, setPremium] = useState("0");
  const [delta, setDelta] = useState("0");
  const provider = useProvider();
  const pricer = new ethers.Contract(
    PRICERS_BY_POOL[pool],
    OptionsPremiumPricerABI,
    provider
  );

  const getPremium = useCallback(async () => {
    if (strike === "" || strike === "0") {
      return;
    }
    if (expiry.utc().unix() <= moment().utc().unix()) {
      return;
    }

    const premium = await pricer.getPremium(
      BigNumber.from(strike).mul(BigNumber.from(10).pow(8)),
      expiry.utc().unix(),
      isPut
    );
    const delta = await pricer["getOptionDelta(uint256,uint256)"](
      BigNumber.from(strike).mul(BigNumber.from(10).pow(8)),
      expiry.utc().unix()
    );
    setPremium(premium.toString());
    setDelta(delta.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiry, strike, isPut]);

  return (
    <Row>
      <Col span={12}>
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
        >
          <Form.Item label="Underlying" name="underlying">
            <Select
              defaultValue={pools[0]}
              style={{ width: 170 }}
              onChange={(val) => setPool(val)}
            >
              {pools.map((pool) => {
                const { name } = ORACLE_METADATA[pool];
                return <Option value={pool}>{name}</Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item label="Strike Price" name="strikePrice">
            <Input
              addonBefore="$"
              defaultValue=""
              placeholder="2000"
              onChange={(e) => setStrike(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Expiry" name="expiry">
            <DatePicker
              defaultPickerValue={expiry}
              defaultValue={expiry}
              onChange={(val) => val && setExpiry(val)}
              showToday={false}
              value={expiry}
            />
          </Form.Item>

          <Form.Item label="Option Type" name="optionType">
            <Radio.Group
              onChange={(e) => setIsPut(e.target.value)}
              value={isPut}
            >
              <Radio value={false}>Call</Radio>
              <Radio value={true}>Put</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit" onClick={getPremium}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>

      <Col offset={2} span={6}>
        <div>
          <h3>Price per option</h3>
          {premium !== "0"
            ? `${parseFloat(formatUnits(BigNumber.from(premium), 18)).toFixed(
                4
              )} ${isPut ? "USDC" : "ETH"}`
            : "--"}
        </div>

        <div style={{ marginTop: 30 }}>
          <h3>Delta</h3>
          {delta !== "0"
            ? `${
                (isPut ? -1 * (10000 - parseInt(delta)) : parseInt(delta)) /
                10000
              }`
            : "--"}
        </div>
      </Col>
    </Row>
  );
};
export default OptionsPricer;
