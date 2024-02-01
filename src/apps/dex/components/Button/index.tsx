import styled from "styled-components";
import { darken } from "polished";

import { RowBetween } from "apps/dex/components/Row";
import { ChevronDown } from "react-feather";
import { Button as RebassButton, ButtonProps } from "rebass/styled-components";
import { FC } from "react";

const Base = styled(RebassButton)<{
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

export const ButtonPrimary = styled(Base)<{ altDisabledStyle?: boolean }>`
  background: linear-gradient(104.04deg, #b3fff9 0%, #00dbcb 100%);
  border-radius: 8px;
  color: ${({ theme }) => theme.text3};
  &:active,
  &:hover {
    box-shadow: 0 0 0 1pt
      ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg4)};
    color: ${({ theme }) => theme.primaryText1};
    border: 1px solid ${({ theme }) => theme.primaryText1};
    background: transparent;
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.bg4 : theme.primary1) : theme.bg4};
    color: ${({ theme }) => theme.text3};
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? "0.5" : "1")};
    &:hover {
      color: ${({ theme }) => theme.white};
    }
  }
`;

export const ButtonLight = styled(Base)`
  background: linear-gradient(104.04deg, #b3fff9 0%, #00dbcb 100%);
  border-radius: 8px;
  color: ${({ theme }) => theme.text3};
  font-size: 17px;
  font-weight: 600;
  gap: 7px;
  &:active,
  &:hover {
    box-shadow: 0 0 0 1pt
      ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg4)};
    color: ${({ theme }) => theme.primaryText1};
    border: 1px solid ${({ theme }) => theme.primaryText1};
    background: transparent;
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.bg4};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

export const ButtonSecondary = styled(Base)<{ padding?: string }>`
  border: 1px solid ${({ theme }) => theme.primary4};
  color: ${({ theme }) => theme.text1};
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : "10px")};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary5};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary5};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary5};
  }
  &:disabled {
    opacity: 50%;
  }
  a:hover {
    text-decoration: none;
  }
`;

export const ButtonOutlined = styled(Base)`
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
  }
`;

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.text1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
  }
`;

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => theme.bg4};
  color: ${({ theme }) => theme.text1};

  &:disabled {
    opacity: 50%;
  }
`;

const ButtonErrorStyle = styled(Base)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    box-shadow: none;
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
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
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  );
}
