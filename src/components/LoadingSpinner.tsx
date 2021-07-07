import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import styled from "styled-components";

interface IProps {
  color?: string;
  loading: boolean;
  height?: string;
  width?: string;
}

const Div = styled.div`
  display: grid;
  place-items: center;
  margin: 1rem;
`;

const LoadingSpinner: React.FC<IProps> = ({ ...props }) => {
  return (
    <Div>
      <ScaleLoader
        color={props.color ? props.color : "#6A6A6A"}
        height={props.height ? props.height : "4rem"}
        width={props.width ? props.width : ".5rem"}
        loading={props.loading}
      />
    </Div>
  );
};

export default LoadingSpinner;
