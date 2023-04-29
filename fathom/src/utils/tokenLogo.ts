import DEFAULT_TOKEN_LIST from "fathom-swap-default-token-list";

export const getTokenLogoURL = (address: string) => {
  let logo;
  let findToken;
  for (let i = 0; i < DEFAULT_TOKEN_LIST.tokens.length; i++) {
    const tokenListItem = DEFAULT_TOKEN_LIST.tokens[i];
    const addressLowerCase = address?.toLowerCase();
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
    logo = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  }

  return logo;
};
