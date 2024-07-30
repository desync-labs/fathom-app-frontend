import { FC, memo, ReactNode } from "react";
import { Box, Button, styled } from "@mui/material";
import { RowBetween } from "apps/charts/components/Row";
import { StyledIcon } from "apps/charts/components";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Base = styled(Button)<{ open?: boolean }>`
  font-size: 15px;
  font-weight: 600;
  line-height: inherit;
  text-decoration: none;
  text-transform: capitalize;
  border-radius: 8px;
  outline: none;
  border: 1px solid transparent;
  padding: 8px 12px;
  border-bottom-right-radius: ${({ open }) => open && "0"};
  border-bottom-left-radius: ${({ open }) => open && "0"};
`;

export const ButtonLight = styled(Base)`
  font-size: 0.825rem;
  font-weight: 600;
  background: transparent;
  border: 1px solid #43fff6;
  color: #43fff6;
  min-width: fit-content;
  border-radius: 8px;
  white-space: nowrap;

  a {
    color: #43fff6;
    :hover {
      color: #fff;
    }
  }

  :hover {
    border: 1px solid #253656;
    color: #fff;
  }
`;

type ButtonDropdownProps = {
  disabled?: boolean;
  children: ReactNode;
  open: boolean;
} & any;

export const ButtonDropdown: FC<ButtonDropdownProps> = memo(
  ({ disabled = false, children, open, ...rest }) => {
    return (
      <ButtonFaded
        {...rest}
        disabled={disabled}
        open={open}
        className={open ? "expanded" : ""}
      >
        <RowBetween>
          <div style={{ display: "flex", alignItems: "center" }}>
            {children}
          </div>
          {open ? (
            <StyledIcon sx={{ color: "#fff" }}>
              <ExpandLessIcon />
            </StyledIcon>
          ) : (
            <StyledIcon sx={{ color: "#fff" }}>
              <ExpandMoreIcon />
            </StyledIcon>
          )}
        </RowBetween>
      </ButtonFaded>
    );
  }
);

export const ButtonDark = styled(Base)`
  background-color: #43fff6;
  color: #002f2d;
  width: fit-content;
  border-radius: 8px;
  white-space: nowrap;

  :hover {
    background: transparent;
    border: 1px solid #43fff6;
    color: #fff;
  }
`;

export const ButtonFaded = styled(Base)`
  height: auto;
  width: 100%;
  background-color: #091433;
  color: #8ea4cc;
  white-space: nowrap;
  border: 1px solid #3d5580;
  border-radius: 8px;
  padding: 6px 12px;
  :hover {
    box-shadow: rgb(0, 60, 255) 0 0 8px;
    background-color: #091433;
  }
  &.expanded {
    border-radius: 8px 8px 0 0;
  }
  @media (max-width: 768px) {
    :hover {
      opacity: 1;
    }
  }
`;

export const OptionButton = styled(Box)<{
  active?: boolean;
  disabled?: boolean;
}>`
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  padding: 6px;
  border-radius: 6px;
  background-color: ${({ active }) => active && "#324567"};
  color: #fff;

  :hover {
    cursor: ${({ disabled }) => !disabled && "pointer"};
  }
`;
