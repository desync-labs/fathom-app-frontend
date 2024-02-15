import { useState, useEffect } from "react";
import { Box, keyframes, styled } from "@mui/material";

import { TYPE, ExternalLink } from "apps/dex/theme";
import { useBlockNumber } from "apps/dex/state/application/hooks";
import { getBlockScanLink } from "apps/dex/utils";
import { useActiveWeb3React } from "apps/dex/hooks";

const StyledPolling = styled(Box)`
  position: fixed;
  display: flex;
  align-items: center;
  right: 0;
  bottom: 0;
  padding: 1rem;
  color: #27ae60;

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: none;
  }
`;
const StyledPollingNumber = styled(TYPE.small)<{
  breathe: boolean;
  hovering: boolean;
}>`
  transition: opacity 0.25s ease;
  opacity: ${({ breathe, hovering }) => (hovering ? 0.7 : breathe ? 1 : 0.2)};
  :hover {
    opacity: 1;
  }
`;
const StyledPollingDot = styled(Box)`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-left: 0.5rem;
  border-radius: 50%;
  position: relative;
  background-color: #27ae60;
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled(Box)`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid #27ae60;
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;

  left: -3px;
  top: -3px;
`;

const Polling = () => {
  const { chainId } = useActiveWeb3React();

  const blockNumber = useBlockNumber();

  const [isMounting, setIsMounting] = useState(false);
  const [isHover, setIsHover] = useState(false);

  useEffect(
    () => {
      if (!blockNumber) {
        return;
      }

      setIsMounting(true);
      const mountingTimer = setTimeout(() => setIsMounting(false), 1000);

      // this will clear Timeout when component unmounts like in willComponentUnmount
      return () => {
        clearTimeout(mountingTimer);
      };
    },
    [blockNumber] //useEffect will run only one time
    //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
  );

  return (
    <ExternalLink
      href={
        chainId && blockNumber
          ? getBlockScanLink(chainId, blockNumber.toString(), "block")
          : ""
      }
    >
      <StyledPolling
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <StyledPollingNumber breathe={isMounting} hovering={isHover}>
          {blockNumber}
        </StyledPollingNumber>
        <StyledPollingDot>{isMounting && <Spinner />}</StyledPollingDot>
      </StyledPolling>
    </ExternalLink>
  );
};

export default Polling;
