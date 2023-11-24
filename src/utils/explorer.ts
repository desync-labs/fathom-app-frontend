import { ChainId, EXPLORERS } from "connectors/networks";

export const getTxUrl = (txHash: string, chainId: ChainId) => {
  if (chainId in EXPLORERS) {
    return `${EXPLORERS[chainId as ChainId]}txs/${txHash}`;
  }
  return "";
};

export const getAccountUrl = (account: string, chainId: ChainId) => {
  if (chainId in EXPLORERS) {
    return `${EXPLORERS[chainId as ChainId]}address/${account}`;
  }
  return "";
};

export const getToken = (tokenAddress: string, chainId: ChainId) => {
  if (chainId in EXPLORERS) {
    return `${EXPLORERS[chainId as ChainId]}tokens/${tokenAddress}`;
  }
  return "";
};
