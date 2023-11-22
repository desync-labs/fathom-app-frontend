import { DEFAULT_CHAIN_ID } from "helpers/Constants";
import { DEFAULT_RPC } from "connectors/networks";
import { JsonRpcProvider } from "@ethersproject/providers";

export const getDefaultProvider = () => {
  return new JsonRpcProvider(DEFAULT_RPC[DEFAULT_CHAIN_ID]);
};
