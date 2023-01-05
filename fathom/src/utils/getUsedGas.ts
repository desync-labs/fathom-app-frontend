import { Contract } from "web3-eth-contract";
import { ESTIMATE_GAS_MULTIPLIER } from "helpers/Constants";

export const getUsedGas = async (
  contract: Contract,
  methodName: string,
  args: any[],
  options: any
) => {
  const gas = await contract.methods[methodName](...args).estimateGas(options);
  return (gas * ESTIMATE_GAS_MULTIPLIER).toString();
};
