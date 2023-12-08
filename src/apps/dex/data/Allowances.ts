import { Token, TokenAmount } from "into-the-fathom-swap-sdk";
import { useMemo } from "react";

import { useTokenContract } from "apps/dex/hooks/useContract";
import { useSingleCallResult } from "apps/dex/state/multicall/hooks";

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false);

  const inputs = useMemo(() => [owner, spender], [owner, spender]);
  const allowance = useSingleCallResult(contract, "allowance", inputs).result;

  return useMemo(
    () =>
      token && allowance
        ? new TokenAmount(token, allowance.toString())
        : undefined,
    [token, allowance]
  );
}
