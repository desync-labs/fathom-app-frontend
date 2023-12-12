import { JSBI } from "into-the-fathom-swap-sdk";
import { useMemo } from "react";
import {
  NEVER_RELOAD,
  useSingleCallResult,
} from "apps/dex/state/multicall/hooks";
import { useActiveWeb3React } from "apps/dex/hooks";
import { useSocksController } from "apps/dex/hooks/useContract";

export default function useSocksBalance(): JSBI | undefined {
  const { account } = useActiveWeb3React();
  const socksContract = useSocksController();

  const { result } = useSingleCallResult(
    socksContract,
    "balanceOf",
    [account ?? undefined],
    NEVER_RELOAD
  );
  const data = result?.[0];
  return data ? JSBI.BigInt(data.toString()) : undefined;
}

export function useHasSocks(): boolean | undefined {
  const balance = useSocksBalance();
  return useMemo(
    () => balance && JSBI.greaterThan(balance, JSBI.BigInt(0)),
    [balance]
  );
}
