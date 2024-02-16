import { Box, styled } from "@mui/material";
import { AutoColumn } from "apps/dex/components/Column";
import { RowBetween } from "apps/dex/components/Row";

export const TextDot = styled(Box)`
  height: 3px;
  width: 3px;
  background-color: #4f658c;
  border-radius: 50%;
`;

export const Checkbox = styled("input")`
  border: 1px solid #d60000;
  height: 20px;
  margin: 0;
`;

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`;

export const MenuItem = styled(RowBetween)<{
  disabled: boolean;
  selected: boolean;
}>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && "pointer"};
  pointer-events: ${({ disabled }) => disabled && "none"};
  :hover {
    background-color: ${({ disabled }) => !disabled && "#061023"};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`;

export const SearchInput = styled("input")`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  outline: none;
  width: 100%;
  color: #ffffff;
  border: 1px solid #253656;
  font-size: 20px;
  border-radius: 8px;
  padding: 15px 20px;
  background-color: #0e1d34;

  :hover,
  :focus {
    border: 1px solid rgb(90, 129, 255);
    box-shadow: rgb(0, 60, 255) 0 0 8px;
  }

  ::placeholder {
    color: #4f658c;
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`;
export const Separator = styled(Box)`
  width: 100%;
  height: 1px;
  background-color: #061023;
`;

export const SeparatorDark = styled(Box)`
  width: 100%;
  height: 1px;
  background-color: #43fff6;
`;
