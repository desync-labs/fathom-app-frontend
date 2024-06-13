import { Box, Button, styled } from "@mui/material";

export const AppNavWrapper = styled(Box)`
  width: fit-content;
  border-bottom: 1.5px solid #1d2d49;
  display: flex;
  align-items: center;
  padding: 0;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

export const AppNavItem = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  color: #9fadc6;
  background: unset;
  border-radius: 0;
  padding: 8px 18px;

  &.active {
    color: #fff;
    border-bottom: 1px solid #00fff6;
  }

  &:hover {
    background-color: unset;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
    width: 100%;
  }
`;
