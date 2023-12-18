import styled from "styled-components";
import TokenLogo from "apps/charts/components/TokenLogo";

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

export default function DoubleTokenLogo(props: {
  a0: any;
  a1: any;
  size?: number;
  margin?: boolean;
}) {
  const { a0, a1, size = 24, margin = false } = props;

  return (
    <TokenWrapper sizeraw={size} margin={margin}>
      <HigherLogo address={a0} size={size.toString() + "px"} sizeraw={size} />
      <CoveredLogo address={a1} size={size.toString() + "px"} sizeraw={size} />
    </TokenWrapper>
  );
}
