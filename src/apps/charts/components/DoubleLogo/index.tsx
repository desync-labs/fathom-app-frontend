import { FC, memo } from "react";
import { Box, styled } from "@mui/material";
import TokenLogo from "apps/charts/components/TokenLogo";

const TokenWrapper = styled(Box)<{ sizeRaw?: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeRaw }) =>
    ((sizeRaw as number) / 3 + 8).toString() + "px"};
`;

const HigherLogo = styled(TokenLogo)`
  z-index: 2;
  border-radius: 50%;
`;

const CoveredLogo = styled(TokenLogo)`
  position: absolute;
  left: ${({ sizeRaw }) => (sizeRaw / 2).toString() + "px"};
  border-radius: 50%;
`;

type DoubleTokenLogoProps = {
  a0: string;
  a1: string;
  size?: number;
};

const DoubleTokenLogo: FC<DoubleTokenLogoProps> = (props) => {
  const { a0, a1, size = 24 } = props;

  return (
    <TokenWrapper sizeRaw={size}>
      <HigherLogo address={a0} size={size.toString() + "px"} sizeRaw={size} />
      <CoveredLogo address={a1} size={size.toString() + "px"} sizeRaw={size} />
    </TokenWrapper>
  );
};

export default memo(DoubleTokenLogo);
