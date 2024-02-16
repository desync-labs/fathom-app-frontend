import { FC } from "react";
import { Button, styled, ButtonProps } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { darken } from "polished";
import { RowBetween } from "apps/dex/components/Row";

const Base = styled(Button)<{
  padding?: string;
  width?: string;
  borderRadius?: string;
  altDisabledStyle?: boolean;
}>`
  padding: ${({ padding }) => (padding ? padding : "18px")};
  width: ${({ width }) => (width ? width : "100%")};
  font-weight: 600;
  text-align: center;
  height: 48px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  text-transform: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: not-allowed;
  }

  > * {
    user-select: none;
  }
`;

export const ButtonPrimary = styled(Base)<{
  fontWeight?: number;
  fontSize?: string;
  altDisabledStyle?: boolean;
}>`
  background: linear-gradient(104.04deg, #b3fff9 0%, #00dbcb 100%);
  border-radius: 8px;
  color: #00332f;
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  &:active,
  &:hover {
    box-shadow: 0 0 0 1pt
      ${({ disabled }) => !disabled && darken(0.05, "#565A69")};
    color: #43fff6;
    border: 1px solid #43fff6;
    background: transparent;
  }
  &:disabled {
    pointer-events: unset;
    background-color: ${({ altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? "#565A69" : "#253656") : "#565A69"};
    color: #00332f;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? "0.5" : "1")};
    &:hover {
      color: #ffffff;
    }
  }
`;

export const ButtonLight = styled(Base)`
  background: linear-gradient(104.04deg, #b3fff9 0%, #00dbcb 100%);
  border-radius: 8px;
  color: #00332f;
  font-size: 17px;
  font-weight: 600;
  gap: 7px;
  &:active,
  &:hover {
    box-shadow: 0 0 0 1pt
      ${({ disabled }) => !disabled && darken(0.05, "#565A69")};
    color: #43fff6;
    border: 1px solid #43fff6;
    background: transparent;
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: #565a69;
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

export const ButtonSecondary = styled(Base)<{
  padding?: string;
  borderRadius?: string;
  width?: string;
}>`
  border: 1px solid #376bad70;
  color: #ffffff;
  background-color: transparent;
  font-size: 16px;
  padding: ${({ padding }) => (padding ? padding : "10px")};
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : "8px")};
  width: ${({ width }) => (width ? width : "auto")};

  &:focus {
    box-shadow: 0 0 0 1pt #376bad70;
    border: 1px solid #22354f;
  }
  &:hover {
    border: 1px solid #22354f;
  }
  &:active {
    box-shadow: 0 0 0 1pt #376bad70;
    border: 1px solid #22354f;
  }
  &:disabled {
    opacity: 50%;
  }
  a:hover {
    text-decoration: none;
  }
`;

export const ButtonOutlined = styled(Base)`
  border: 1px solid #061023;
  background-color: transparent;
  color: #ffffff;

  &:focus {
    box-shadow: 0 0 0 1px #565a69;
  }
  &:hover {
    box-shadow: 0 0 0 1px #565a69;
  }
  &:active {
    box-shadow: 0 0 0 1px #565a69;
  }
  &:disabled {
    opacity: 50%;
  }
`;

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
    background: transparent;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
  }
`;

const ButtonConfirmedStyle = styled(Base)`
  background-color: #565a69;
  color: #ffffff;

  &:disabled {
    opacity: 50%;
  }
`;

const ButtonErrorStyle = styled(Base)`
  color: #ffffff;
  background-color: #fd4040;
  border: 1px solid #fd4040;

  &:focus {
    box-shadow: 0 0 0 1pt ${darken(0.05, "#fd4040")};
    background-color: ${darken(0.05, "#fd4040")};
  }
  &:hover {
    background-color: ${darken(0.05, "#fd4040")};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, "#fd4040")};
    background-color: ${darken(0.1, "#fd4040")};
  }
  &:disabled {
    color: #ffffff;
    opacity: 50%;
    box-shadow: none;
    background-color: #fd4040;
    border: 1px solid #fd4040;
  }
`;

type ButtonConfirmedProps = {
  confirmed?: boolean;
  altDisabledStyle?: boolean;
} & ButtonProps;

export const ButtonConfirmed: FC<ButtonConfirmedProps> = ({
  confirmed,
  altDisabledStyle,
  ...rest
}) => {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />;
  }
};

type ButtonErrorProps = { error?: boolean } & ButtonProps;

export const ButtonError: FC<ButtonErrorProps> = ({ error, ...rest }) => {
  if (error) {
    return <ButtonErrorStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} />;
  }
};

export function ButtonDropdownLight({
  disabled = false,
  children,
  ...rest
}: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: "flex", alignItems: "center" }}>{children}</div>
        <ExpandMoreIcon sx={{ width: "24px", height: "24px" }} />
      </RowBetween>
    </ButtonOutlined>
  );
}
