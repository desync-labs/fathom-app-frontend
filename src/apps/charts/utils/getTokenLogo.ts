import DEFAULT_TOKEN_LIST from "fathom-swap-standard-token-list";

export const getTokenLogoURL = (address: string) => {
  let logo;
  let findToken;
  const addressLowerCase = address.toLowerCase();
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
