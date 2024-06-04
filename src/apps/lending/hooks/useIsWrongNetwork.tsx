import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";

import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";

export function useIsWrongNetwork(_requiredChainId?: number) {
  const { currentChainId } = useProtocolDataContext();
  const { chainId: connectedChainId } = useWeb3Context();

  const requiredChainId = _requiredChainId ? _requiredChainId : currentChainId;
  const isWrongNetwork = connectedChainId !== requiredChainId;

  return {
    isWrongNetwork,
    requiredChainId,
  };
}
