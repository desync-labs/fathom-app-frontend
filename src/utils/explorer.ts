import { ChainId, EXPLORERS } from "connectors/networks";
import { DEFAULT_CHAIN_ID } from "utils/Constants";

export const getTxUrl = (txHash: string, chainId: ChainId) => {
  return chainId in EXPLORERS
    ? `${EXPLORERS[chainId as ChainId]}txs/${txHash}`
    : "";
};

export const getAccountUrl = (account: string, chainId: ChainId) => {
  return chainId in EXPLORERS
    ? `${EXPLORERS[chainId as ChainId]}address/${account}`
    : `${EXPLORERS[DEFAULT_CHAIN_ID]}address/${account}`;
};

export const getToken = (tokenAddress: string, chainId: ChainId) => {
  return chainId in EXPLORERS
    ? `${EXPLORERS[chainId as ChainId]}tokens/${tokenAddress}`
    : "";
};
