import { Currency, Token, XDC } from "into-the-fathom-swap-sdk";
import { useMemo } from "react";
import styled from "styled-components";

import XdcLogo from "apps/dex/assets/images/xdc-logo.png";
import useHttpLocations from "apps/dex/hooks/useHttpLocations";
import { WrappedTokenInfo } from "apps/dex/state/lists/hooks";
import Logo from "apps/dex/components/Logo";
import DEFAULT_TOKEN_LIST from "fathom-swap-standard-token-list";

export const getTokenLogoURL = (address: string) => {
  let logo;
  const findToken = DEFAULT_TOKEN_LIST.tokens.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  );
  if (findToken) {
    logo = findToken.logoURI;
  } else {
    logo = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  }

  return logo;
};

const StyledXdcLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`;

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`;

export default function CurrencyLogo({
  currency,
  size = "24px",
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI : undefined
  );

  const srcs: string[] = useMemo(() => {
    if (currency === XDC) return [];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)];
      }
      return [getTokenLogoURL(currency.address)];
    }
    return [];
  }, [currency, uriLocations]);

  if (currency === XDC) {
    return <StyledXdcLogo src={XdcLogo} size={size} style={style} />;
  }

  return (
    <StyledLogo
      size={size}
      srcs={srcs}
      alt={`${currency?.symbol ?? "token"} logo`}
      style={style}
    />
  );
}
