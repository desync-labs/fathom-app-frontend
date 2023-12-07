import { Web3Provider } from "@ethersproject/providers";
import useConnector from "context/connector";

export function useActiveWeb3React() {
  const context = useConnector();
  const newContext = {
    ...context,
    library: context.library as Web3Provider,
  };

  return newContext;
}
