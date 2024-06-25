import { formatNumber } from "utils/format";
import { IVault } from "fathom-sdk";
import BigNumber from "bignumber.js";
import { ApyConfig } from "utils/Vaults/getApyConfig";

const EDUCATION_STRATEGY_ID = "0x3c8e9896933b374e638f9a5c309535409129aaa2";

const useApr = (vault: IVault) => {
  if (vault.id === EDUCATION_STRATEGY_ID) {
    return formatNumber(
      (394200 /
        BigNumber(vault.balanceTokens)
          .dividedBy(10 ** 18)
          .toNumber()) *
        100
    );
  }

  if (ApyConfig[vault.id]) {
    return formatNumber(ApyConfig[vault.id]);
  }

  return formatNumber(Number(vault.apr));
};

const useAprNumber = (vault: IVault) => {
  if (vault.id === EDUCATION_STRATEGY_ID) {
    return (
      (394200 /
        BigNumber(vault.balanceTokens)
          .dividedBy(10 ** 18)
          .toNumber()) *
      100
    );
  }

  if (ApyConfig[vault.id]) {
    return ApyConfig[vault.id];
  }

  return Number(vault.apr);
};

const getApr = (currentDept: string, vaultId: string, apr: string) => {
  if (vaultId === EDUCATION_STRATEGY_ID) {
    return BigNumber(394200)
      .dividedBy(BigNumber(currentDept).dividedBy(10 ** 18))
      .multipliedBy(100)
      .toString();
  }

  if (ApyConfig[vaultId]) {
    return ApyConfig[vaultId].toString();
  }

  return apr;
};

export { useApr, useAprNumber, getApr };
