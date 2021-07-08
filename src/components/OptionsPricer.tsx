import React from "react";
import moment from "moment";
import { Select, Radio, Form, DatePicker, Input } from "antd";
import { ORACLE_METADATA, Pools } from "../hooks/useVolOracles";

const { Option } = Select;

const InputRow: React.FC = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: 300,
      }}
    >
      {children}
    </div>
  );
};

const OptionsPricer = () => {
  const pools = Object.keys(ORACLE_METADATA) as Pools[];

  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
      >
        <Form.Item label="Underlying" name="underlying">
          <Select
            defaultValue={pools[0]}
            style={{ width: 170 }}
            onChange={() => {}}
          >
            {pools.map((pool) => {
              const { name } = ORACLE_METADATA[pool];
              return <Option value={pool}>{name}</Option>;
            })}
          </Select>
        </Form.Item>

        <Form.Item label="Strike Price" name="strikePrice">
          <Input addonBefore="$" defaultValue="" placeholder="2000" />
        </Form.Item>

        <Form.Item label="Expiry" name="expiry">
          <DatePicker
            defaultPickerValue={moment().add(1, "weeks")}
            defaultValue={moment().add(1, "weeks")}
            onChange={() => {}}
          />
        </Form.Item>

        <Form.Item label="Option Type" name="optionType">
          <Radio.Group onChange={() => {}} value={1}>
            <Radio value={1}>Call</Radio>
            <Radio value={2}>Put</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
  );
};
export default OptionsPricer;
