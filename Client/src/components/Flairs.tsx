import { Select } from "@chakra-ui/react";
import React, { FC } from "react";
import { flairs } from "../utils/flair";

interface FlairsProps {
  onChange: (value: string) => void;
  value: string;
}

const Flairs: FC<FlairsProps> = ({ onChange, value }) => {
  const keys = Object.keys(flairs);

  return (
    <Select
      bg="var(--white-color)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select Flair</option>
      {keys.map((item: string) => (
        <option
          style={{ background: "white" }}
          key={item}
          value={(flairs as any)[item]}
        >
          {item}
        </option>
      ))}
    </Select>
  );
};

export default Flairs;
