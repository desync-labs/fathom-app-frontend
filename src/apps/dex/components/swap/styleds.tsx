import { transparentize } from "polished";
import { Box, css, styled, Typography } from "@mui/material";
import { AutoColumn } from "apps/dex/components/Column";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export const Wrapper = styled(Box)`
  position: relative;
  padding: 1rem;
`;

export const ArrowWrapper = styled(Box)<{ clickable: boolean }>`
  padding: 2px;
  z-index: 10;
  display: flex;
  background-color: #131f35;
  align-items: center;
  width: 36px;
  height: 36px;
  justify-content: center;
  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`;

export const ArrowDownWrapped = styled(Box)`
  width: 30px;
  height: 30px;
  background: #6379a1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SectionBreak = styled(Box)`
  height: 1px;
  width: 100%;
  background-color: #2c3f59;
`;

export const BottomGrouping = styled(Box)`
  margin-top: 1rem;
`;

export const ErrorText = styled(Typography)<{ severity?: 0 | 1 | 2 | 3 | 4 }>`
  color: ${({ severity }) =>
    severity === 3 || severity === 4
      ? "#FD4040"
      : severity === 2
      ? "#F3841E"
      : severity === 1
      ? "#fff"
      : "#27AE60"};
`;

export const StyledBalanceMaxMini = styled("button")`
  height: 22px;
  width: 22px;
  background-color: #061023;
  border: none;
  border-radius: 50%;
  padding: 0.2rem;
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.4rem;
  cursor: pointer;
  color: #4f658c;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;

  :hover {
    background-color: #131f35;
  }
  :focus {
    background-color: #131f35;
    outline: none;
  }
`;

export const TruncatedText = styled(Typography)`
  text-overflow: ellipsis;
  width: 220px;
  overflow: hidden;
`;

// styles
export const Dots = styled("span")`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: ".";
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: ".";
    }
    33% {
      content: "..";
    }
    66% {
      content: "...";
    }
  }
`;

const SwapCallbackErrorInner = styled(Box)`
  background-color: ${transparentize(0.9, "#FD4040")};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 3rem 1.25rem 1rem 1rem;
  margin-top: -2rem;
  color: #fd4040;
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`;

const SwapCallbackErrorInnerAlertTriangle = styled(Box)`
  background-color: ${transparentize(0.9, "#FD4040")};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
`;

export function SwapCallbackError({ error }: { error: string }) {
  return (
    <SwapCallbackErrorInner>
      <SwapCallbackErrorInnerAlertTriangle>
        <WarningAmberIcon sx={{ width: "24px", height: "24px" }} />
      </SwapCallbackErrorInnerAlertTriangle>
      <p>{error}</p>
    </SwapCallbackErrorInner>
  );
}

export const SwapShowAcceptChanges = styled(AutoColumn)`
  background-color: ${transparentize(0.9, "#253656")};
  color: #253656;
  padding: 0.5rem;
  border-radius: 12px;
  margin-top: 8px;
`;
