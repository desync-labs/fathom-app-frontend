import styled from "styled-components";
import Settings from "apps/dex/components/Settings";
import { RowBetween } from "apps/dex/components/Row";
import { TYPE } from "apps/dex/theme";

const StyledSwapHeader = styled.div`
  padding: 1.5rem 1rem 0.5rem 1.5rem;
  width: 100%;
  max-width: 600px;
  color: ${({ theme }) => theme.text2};
`;

const SwapHeaderRow = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.white};
`;

const SwapHeader = () => {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <SwapHeaderRow>
          <TYPE.white>Swap</TYPE.white>
        </SwapHeaderRow>
        <Settings />
      </RowBetween>
    </StyledSwapHeader>
  );
};

export default SwapHeader;
