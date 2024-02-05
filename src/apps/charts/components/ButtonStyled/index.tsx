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
      <ButtonFaded {...rest} disabled={disabled} open={open}>
        <RowBetween>
          <div style={{ display: "flex", alignItems: "center" }}>
            {children}
          </div>
          {open ? (
            <StyledIcon>
              <ExpandLessIcon />
            </StyledIcon>
          ) : (
            <StyledIcon>
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
  width: 100%;
  background-color: #0e1d34;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  border: 1px solid #253656;
  padding: 6px 12px;
  :hover {
    opacity: 0.5;
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
