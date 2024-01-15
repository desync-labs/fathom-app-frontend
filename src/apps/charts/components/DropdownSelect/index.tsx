import { FC, memo, useState } from "react";
import styled from "styled-components";

import Row, { RowBetween } from "apps/charts/components/Row";
import { AutoColumn } from "apps/charts/components/Column";
import { ChevronDown as Arrow } from "react-feather";
import { TYPE } from "apps/charts/Theme";
import { StyledIcon } from "apps/charts/components";

const Wrapper = styled.div<{ open?: boolean; color?: string; shadow?: string }>`
  z-index: 20;
  position: relative;
  background-color: ${({ theme }) => theme.panelColor};
  border: 1px solid
    ${({ open, color }) =>
      open ? (color ? color : "transparent") : "rgba(0, 0, 0, 0.15);"};
  box-shadow: ${({ open, shadow }) => (open && shadow ? shadow : "none")};
  width: 100px;
  padding: 4px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 34px;
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 10px;
  border-radius: 8px;
  width: calc(100% - 20px);
  font-weight: 500;
  font-size: 1rem;
  color: black;
  :hover {
    cursor: pointer;
  }
`;

const ArrowStyled = styled(Arrow)`
  height: 20px;
  width: 20px;
  margin-left: 6px;
`;

type DropdownSelectProps = {
  options: any;
  active: any;
  setActive: any;
  color?: string;
  shadow?: string;
};

const DropdownSelect: FC<DropdownSelectProps> = (props) => {
  const { options, active, setActive, color, shadow } = props;
  const [showDropdown, toggleDropdown] = useState<boolean>(false);

  return (
    <Wrapper open={showDropdown} color={color} shadow={shadow}>
      <RowBetween
        onClick={() => toggleDropdown(!showDropdown)}
        justify="center"
      >
        <TYPE.main>{active}</TYPE.main>
        <StyledIcon style={{ display: "flex", alignItems: "center" }}>
          <ArrowStyled />
        </StyledIcon>
      </RowBetween>
      {showDropdown && (
        <Dropdown>
          <AutoColumn gap="10px">
            {Object.keys(options).map((key, index) => {
              const option = options[key];
              return (
                option !== active && (
                  <Row
                    onClick={() => {
                      toggleDropdown(!showDropdown);
                      setActive(option);
                    }}
                    key={index}
                  >
                    <TYPE.body fontSize={14}>{option}</TYPE.body>
                  </Row>
                )
              );
            })}
          </AutoColumn>
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default memo(DropdownSelect);
