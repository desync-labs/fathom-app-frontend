import { Contract } from "@into-the-fathom/contracts";
import { WETH } from "into-the-fathom-swap-sdk";
import { abi as IUniswapV2PairABI } from "into-the-fathom-swap-smart-contracts/artifacts/contracts/core/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json";

import { useMemo } from "react";
import { ERC20_BYTES32_ABI } from "apps/dex/constants/abis/erc20";
import ERC20_ABI from "apps/dex/constants/abis/erc20.json";
import WETH_ABI from "apps/dex/constants/abis/weth.json";
import {
  MULTICALL_ABI,
  MULTICALL_NETWORKS,
} from "apps/dex/constants/multicall";
import { getContract } from "apps/dex/utils";
import { useActiveWeb3React } from "apps/dex/hooks";

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? WETH[chainId]?.address : undefined,
    WETH_ABI,
    withSignerIfPossible
  );
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false
  );
}
