import { FC } from "react";
import { styled } from "@mui/material";

const ToggleElement = styled("span")<{
  isActive?: boolean;
  isOnSwitch?: boolean;
}>`
  background: ${({ isActive, isOnSwitch }) =>
    isActive ? (isOnSwitch ? "#253656" : "#565A69") : "none"};
  color: ${({ isActive, isOnSwitch }) =>
    isActive ? (isOnSwitch ? "#fff" : "#4F658C") : "#00332F"};
  padding: 0.35rem 0.6rem;
  border-radius: 12px;
  background: ${({ isActive }) => (isActive ? "#253656" : "none")};
  color: ${({ isActive }) => (isActive ? "#fff" : "#4F658C")};
  font-size: 1rem;
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? "500" : "400")};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? "none" : "initial")};
    background: ${({ isActive }) => (isActive ? "#253656" : "none")};
    color: "#fff";
  }
`;

const StyledToggle = styled("button")<{
  isActive?: boolean;
  activeElement?: boolean;
}>`
  border-radius: 12px;
  border: none;
  background: #061023;
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;
`;

export interface ToggleProps {
  id?: string;
  isActive: boolean;
  toggle: () => void;
}

const Toggle: FC<ToggleProps> = ({ id, isActive, toggle }) => {
  return (
    <StyledToggle id={id} isActive={isActive} onClick={toggle}>
      <ToggleElement isActive={isActive} isOnSwitch={true}>
        On
      </ToggleElement>
      <ToggleElement isActive={!isActive} isOnSwitch={false}>
        Off
      </ToggleElement>
    </StyledToggle>
  );
};

export default Toggle;
