import {
  NEVER_RELOAD,
  useSingleCallResult,
} from "apps/dex/state/multicall/hooks";
import { useActiveWeb3React } from "apps/dex/hooks";
import { useArgentWalletDetectorContract } from "apps/dex/hooks/useContract";

export default function useIsArgentWallet(): boolean {
  const { account } = useActiveWeb3React();
  const argentWalletDetector = useArgentWalletDetectorContract();
  const call = useSingleCallResult(
    argentWalletDetector,
    "isArgentWallet",
    [account ?? undefined],
    NEVER_RELOAD
  );
  return call?.result?.[0] ?? false;
}
