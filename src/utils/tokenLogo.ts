import DEFAULT_TOKEN_LIST from "fathom-swap-standard-token-list";

const TOKEN_LIST_LOGOS = ["cgo", "eth"];

export type TokenItem = {
  address: string;
  chainId?: number;
  decimals?: number;
  logoURI?: string;
  name: string;
  symbol: string;
};

export const getTokenLogoURL = (address: string) => {
  let logo;
  let findToken;
  const addressLowerCase = address?.toLowerCase();

  if (TOKEN_LIST_LOGOS.includes(addressLowerCase)) {
    return `/icons/tokens/${addressLowerCase}.svg`;
  }

  for (let i = 0; i < DEFAULT_TOKEN_LIST.tokens.length; i++) {
    const tokenListItem = DEFAULT_TOKEN_LIST.tokens[i];
    if (
      tokenListItem.address.toLowerCase() === addressLowerCase ||
      tokenListItem.name.toLowerCase() === addressLowerCase ||
      tokenListItem.symbol.toLowerCase() === addressLowerCase
    ) {
      findToken = tokenListItem;
      break;
    }
  }

  if (findToken) {
    logo = findToken.logoURI;
  } else {
    logo = `https://raw.githubusercontent.com/Into-the-Fathom/assets/master/blockchains/xinfin/${address}/logo.png`;
  }
  return logo;
};

export const getTokenInfo = (address: string): TokenItem => {
  const addressLowerCase = address?.toLowerCase();

  for (let i = 0; i < DEFAULT_TOKEN_LIST.tokens.length; i++) {
    const tokenListItem = DEFAULT_TOKEN_LIST.tokens[i];
    if (
      tokenListItem.address.toLowerCase() === addressLowerCase ||
      tokenListItem.name.toLowerCase() === addressLowerCase ||
      tokenListItem.symbol.toLowerCase() === addressLowerCase
    ) {
      return tokenListItem;
    }
  }

  return { address: "", name: "", symbol: "" };
};
