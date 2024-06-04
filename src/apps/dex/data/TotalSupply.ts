import { BigNumber } from "@into-the-fathom/bignumber";
import { Token, TokenAmount } from "into-the-fathom-swap-sdk";
import { useTokenContract } from "apps/dex/hooks/useContract";
import { useSingleCallResult } from "apps/dex/state/multicall/hooks";

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false);

  const totalSupply: BigNumber = useSingleCallResult(contract, "totalSupply")
    ?.result?.[0];

  return token && totalSupply
    ? new TokenAmount(token, totalSupply.toString())
    : undefined;
}
