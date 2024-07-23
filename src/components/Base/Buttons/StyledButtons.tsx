import { styled } from "@mui/material/styles";
import { Box, IconButton as MuiButton, ToggleButtonGroup } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

export const BaseButtonsSwitcherGroup = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: stretch;
  width: 100%;
  height: fit-content;
  background: #091433;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 16px;
`;

export const BaseSwitcherButton = styled(MuiButton)`
  align-items: center;
  height: 40px;
  width: calc(50% - 4px);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: transparent;
  &.active {
    background: #3d5580;
  }
`;

export const BaseButtonSecondary = styled(MuiButton)`
  color: #43FFF1;
  font-weight: bold;
  font-size: 15px;
  line-height: 20px;
  padding: 8px 16px;
  gap: 8px;
  border: 1px solid #009E92;
  border-radius: 8px;
  height: 40px;
  &:hover {
    background: transparent;
    color: #B3FFF9;
    border: 1px solid #B3FFF9;
    svg: {
      color: #B3FFF9;
    }, 
  }
  &:disabled {
    color: gray;
    background: transparent;
    border-color: gray;
    cursor: not-allowed !important;
    pointer-events: all !important; 
  }
`;

export const BaseButtonSecondaryLink = styled("a")`
  display: flex;
  align-items: center;  
  color: #43FFF1;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  padding: 8px 16px;
  gap: 8px;
  border: 1px solid #009E92;
  border-radius: 8px;
  height: 36px;
  &:hover {
    background: transparent;
    color: #B3FFF9;
    border: 1px solid #B3FFF9;
    svg {
      color: #B3FFF9;
    }, 
  }
  &:disabled {
    color: gray;
    background: transparent;
    border-color: gray;
    cursor: not-allowed !important;
    pointer-events: all !important; 
  }
  
  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: 28px;
    font-size: 11px;
    padding: 8px;
  }
`;

export const ExtLinkIcon = styled(OpenInNewRoundedIcon, {
  shouldForwardProp: (prop) => prop !== "scroll",
})<{ width?: string; height?: string }>`
  width: ${({ width = "16px" }) => width};
  height: ${({ height = "16px" }) => height};
  color: #43fff1;
  margin-left: 4px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-left: 0;
  }
`;

export const BaseToggleButtonGroup = styled(ToggleButtonGroup)`
  gap: 8px;
  width: 100%;

  & .MuiToggleButton-root {
    height: 36px;
    font-size: 14px;
    font-weight: 400;
    border-radius: 6px;
    background: rgba(79, 101, 140, 0.3);
    padding: 4px 8px;
    width: 25%;

    &.Mui-selected {
      font-weight: 600;
    }
  }
`;
