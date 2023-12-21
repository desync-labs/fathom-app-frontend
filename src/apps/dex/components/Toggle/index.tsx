import styled from "styled-components";
import { FC } from "react";

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  background: ${({ theme, isActive, isOnSwitch }) =>
    isActive ? (isOnSwitch ? theme.primary1 : theme.text4) : "none"};
  color: ${({ theme, isActive, isOnSwitch }) =>
    isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text3};
  padding: 0.35rem 0.6rem;
  border-radius: 12px;
  background: ${({ theme, isActive }) => (isActive ? theme.primary1 : "none")};
  color: ${({ theme, isActive }) => (isActive ? theme.white : theme.text2)};
  font-size: 1rem;
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? "500" : "400")};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? "none" : "initial")};
    background: ${({ theme, isActive }) =>
      isActive ? theme.primary1 : "none"};
    color: ${({ theme }) => theme.white};
  }
`;

const StyledToggle = styled.button<{
  isActive?: boolean;
  activeElement?: boolean;
}>`
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.bg2};
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
