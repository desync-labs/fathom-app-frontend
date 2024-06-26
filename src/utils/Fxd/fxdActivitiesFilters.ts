import { getTokenInfo } from "utils/tokenLogo";
import { NATIVE_ASSETS } from "connectors/networks";

export const filterPoolCollateralAddress = (
  search: string,
  collateralTokenAddresses: string[]
) => {
  return collateralTokenAddresses.some((address) => {
    return address.toLowerCase().includes(search.toLowerCase());
  });
};

export const filterPoolSymbol = (search: string, txPoolSymbol: string) => {
  return txPoolSymbol.toLowerCase().includes(search.toLowerCase());
};

export const filterCollateralName = (
  search: string,
  collateralName: string
) => {
  const formattedCollateralName = NATIVE_ASSETS.includes(
    collateralName.toUpperCase()
  )
    ? `W${collateralName.toUpperCase()}`
    : collateralName.toUpperCase();

  const tokenInfo = getTokenInfo(formattedCollateralName);

  if (tokenInfo) {
    return (
      tokenInfo.name.toLowerCase().includes(search.toLowerCase()) ||
      tokenInfo.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }

  return false;
};

export const filterTransaction = (search: string, tx: string) => {
  return tx.toLowerCase().includes(search.toLowerCase());
};
