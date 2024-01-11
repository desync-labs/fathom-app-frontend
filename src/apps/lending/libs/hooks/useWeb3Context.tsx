import { useContext, createContext } from "react";

import { Web3Data } from "apps/lending/libs/web3-data-provider/Web3Provider";

export type Web3ContextData = {
  web3ProviderData: Web3Data;
};

export const Web3Context = createContext({} as Web3ContextData);

export const useWeb3Context = () => {
  const { web3ProviderData } = useContext(Web3Context);
  if (Object.keys(web3ProviderData).length === 0) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " +
        "please declare it at a higher level."
    );
  }

  return web3ProviderData;
};
