import { DEFAULT_CHAIN_ID } from "helpers/Constants";
import Xdc3 from "xdc3";
import { DEFAULT_RPC } from "connectors/networks";

export const getDefaultProvider = () => {
  return new Xdc3(DEFAULT_RPC[DEFAULT_CHAIN_ID]);
};
