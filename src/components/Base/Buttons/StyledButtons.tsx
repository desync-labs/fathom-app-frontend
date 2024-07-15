import { styled } from "@mui/material/styles";
import { Box, IconButton as MuiButton } from "@mui/material";

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
