import styled from "styled-components";
import { Sun, Moon } from "react-feather";
import { FC } from "react";

const IconWrapper = styled.div<{ isActive?: boolean }>`
  opacity: ${({ isActive }) => (isActive ? 0.8 : 0.4)};

  :hover {
    opacity: 1;
  }
`;

const StyledToggle = styled.div`
  display: flex;
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  margin-top: 1rem;
  color: white;

  :hover {
    text-decoration: none;
  }
`;

type ToggleProps = { isActive: boolean; toggle: any };

const Toggle: FC<ToggleProps> = (props) => {
  const { isActive, toggle } = props;
  return (
    <StyledToggle onClick={toggle}>
      <span>
        <IconWrapper isActive={!isActive}>
          <Sun size={20} />
        </IconWrapper>
      </span>
      <span style={{ padding: "0 .5rem" }}>{" / "}</span>
      <span>
        <IconWrapper isActive={isActive}>
          <Moon size={20} />
        </IconWrapper>
      </span>
    </StyledToggle>
  );
};

export default Toggle;
