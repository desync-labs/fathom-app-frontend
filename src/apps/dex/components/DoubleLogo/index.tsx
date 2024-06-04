import { FC } from "react";
import { Currency } from "into-the-fathom-swap-sdk";
import { Box, styled } from "@mui/material";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";

const Wrapper = styled(Box)<{ isMargin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, isMargin }) =>
    isMargin && (sizeraw / 3 + 8).toString() + "px"};
`;

interface DoubleCurrencyLogoProps {
  margin?: boolean;
  size?: number;
  currency0?: Currency;
  currency1?: Currency;
}

const HigherLogo = styled(CurrencyLogo)`
  z-index: 2;
`;
const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => "-" + (sizeraw / 2).toString() + "px"} !important;
`;

const DoubleCurrencyLogo: FC<DoubleCurrencyLogoProps> = ({
  currency0,
  currency1,
  size = 16,
  margin = false,
}) => {
  return (
    <Wrapper sizeraw={size} isMargin={margin}>
      {currency0 && (
        <HigherLogo currency={currency0} size={size.toString() + "px"} />
      )}
      {currency1 && (
        <CoveredLogo
          currency={currency1}
          size={size.toString() + "px"}
          sizeraw={size}
        />
      )}
    </Wrapper>
  );
};

export default DoubleCurrencyLogo;
