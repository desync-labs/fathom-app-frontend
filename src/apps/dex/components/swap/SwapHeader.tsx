import { Box, styled } from "@mui/material";
import Settings from "apps/dex/components/Settings";
import { RowBetween } from "apps/dex/components/Row";
import { TYPE } from "apps/dex/theme";

const StyledSwapHeader = styled(Box)`
  padding: 1.5rem 1rem 0.5rem 1.5rem;
  width: 100%;
  max-width: 600px;
  color: #4f658c;
`;

const SwapHeaderRow = styled(Box)`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
`;

const SwapHeader = () => {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <SwapHeaderRow>
          <TYPE.white fontSize={"20px"}>Swap</TYPE.white>
        </SwapHeaderRow>
        <Settings />
      </RowBetween>
    </StyledSwapHeader>
  );
};

export default SwapHeader;
