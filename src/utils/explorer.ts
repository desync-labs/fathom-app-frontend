import { ChainId, EXPLORERS } from "connectors/networks";

export const getTxUrl = (txHash: string, chainId: ChainId) => {
  return chainId in EXPLORERS
    ? `${EXPLORERS[chainId as ChainId]}txs/${txHash}`
    : "";
};

export const getAccountUrl = (account: string, chainId: ChainId) => {
  return chainId in EXPLORERS
    ? `${EXPLORERS[chainId as ChainId]}address/${account}`
    : "";
};

export const getToken = (tokenAddress: string, chainId: ChainId) => {
  return chainId in EXPLORERS
    ? `${EXPLORERS[chainId as ChainId]}tokens/${tokenAddress}`
    : "";
};
