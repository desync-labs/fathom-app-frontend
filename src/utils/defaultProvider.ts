import { DEFAULT_CHAIN_ID } from "utils/Constants";
import { DEFAULT_RPCS } from "connectors/networks";
import { JsonRpcProvider } from "@into-the-fathom/providers";

export const getDefaultProvider = () => {
  return new JsonRpcProvider(DEFAULT_RPCS[DEFAULT_CHAIN_ID]);
};
