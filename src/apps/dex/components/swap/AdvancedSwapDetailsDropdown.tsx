import { FC } from "react";
import { Box, styled } from "@mui/material";
import { useLastTruthy } from "apps/dex/hooks/useLast";
import {
  AdvancedSwapDetails,
  AdvancedSwapDetailsProps,
} from "apps/dex/components/swap/AdvancedSwapDetails";

const AdvancedDetailsFooter = styled(Box)<{ show: boolean }>`
  padding-top: ${({ show }) => (show ? "calc(16px + 2rem)" : "0")};
  padding-bottom: ${({ show }) => (show ? "16px" : "0")};
  margin-top: ${({ show }) => (show ? "-2rem" : "0")};
  width: 100%;
  max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: #4f658c;
  z-index: -1;

  transform: ${({ show }) => (show ? "translateY(0%)" : "translateY(-100%)")};
  transition: transform 300ms ease-in-out;
`;

const AdvancedSwapDetailsDropdown: FC<AdvancedSwapDetailsProps> = ({
  trade,
  ...rest
}) => {
  const lastTrade = useLastTruthy(trade);

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  );
};

export default AdvancedSwapDetailsDropdown;
