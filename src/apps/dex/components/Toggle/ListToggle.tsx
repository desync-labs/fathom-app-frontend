import { FC } from "react";
import { styled, Typography } from "@mui/material";

const Wrapper = styled("button")<{
  isActive?: boolean;
  activeElement?: boolean;
}>`
  border-radius: 20px;
  border: none;
  background: #131f35;
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0.4rem 0.4rem;
  align-items: center;
`;

const ToggleElement = styled("span")<{ isActive?: boolean; bgColor?: string }>`
  border-radius: 50%;
  height: 24px;
  width: 24px;
  background-color: ${({ isActive, bgColor }) =>
    isActive ? bgColor : "#565A69"};
  :hover {
    opacity: 0.8;
  }
`;

const StatusText = styled(Typography)<{ isActive?: boolean }>`
  margin: 0 10px;
  width: 24px;
  color: ${({ isActive }) => (isActive ? "#ffffff" : "#00332F")};
`;

export interface ToggleProps {
  id?: string;
  isActive: boolean;
  bgColor: string;
  toggle: () => void;
}

const ListToggle: FC<ToggleProps> = ({ id, isActive, bgColor, toggle }) => {
  return (
    <Wrapper id={id} isActive={isActive} onClick={toggle}>
      {isActive && (
        <StatusText fontWeight="600" margin="0 6px" isActive={true}>
          ON
        </StatusText>
      )}
      <ToggleElement isActive={isActive} bgColor={bgColor} />
      {!isActive && (
        <StatusText fontWeight="600" margin="0 6px" isActive={false}>
          OFF
        </StatusText>
      )}
    </Wrapper>
  );
};

export default ListToggle;
