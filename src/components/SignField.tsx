import React from "react";
import { ISignField } from "../interfaces/ISignField";

const SignField: React.FC<ISignField> = ({ ...props }) => {
  return (
    <div>
      <label>{props.label}</label>
      <input
        required
        value={props.value}
        type={props.type}
        onChange={(e) => {
          props.changeValue(e.target.value);
          if (props.clearError) {
            props.clearError("");
          }
        }}
      />
    </div>
  );
};

export default SignField;
