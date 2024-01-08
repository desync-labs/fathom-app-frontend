import styled from "styled-components";
import TokenLogo from "apps/charts/components/TokenLogo";
import { FC, memo } from "react";

const TokenWrapper = styled.div<{ sizeraw?: number; margin?: any }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) =>
    margin && ((sizeraw as number) / 3 + 8).toString() + "px"};
`;

const HigherLogo = styled(TokenLogo)`
  z-index: 2;
  border-radius: 50%;
`;

const CoveredLogo = styled(TokenLogo)`
  position: absolute;
  left: ${({ sizeraw }) => (sizeraw / 2).toString() + "px"};
  border-radius: 50%;
`;

type DoubleTokenLogoProps = {
  a0: string;
  a1: string;
  size?: number;
  margin?: boolean;
};

const DoubleTokenLogo: FC<DoubleTokenLogoProps> = (props) => {
  const { a0, a1, size = 24, margin = false } = props;

  return (
    <TokenWrapper sizeraw={size} margin={margin}>
      <HigherLogo address={a0} size={size.toString() + "px"} sizeraw={size} />
      <CoveredLogo address={a1} size={size.toString() + "px"} sizeraw={size} />
    </TokenWrapper>
  );
};

export default memo(DoubleTokenLogo);
