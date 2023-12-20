import { utils } from "fathom-ethers";
import { useMemo } from "react";
import { useSingleCallResult } from "apps/dex/state/multicall/hooks";
import isZero from "apps/dex/utils/isZero";
import {
  useENSRegistrarContract,
  useENSResolverContract,
} from "apps/dex/hooks/useContract";

/**
 * Does a lookup for an ENS name to find its contenthash.
 */
export default function useENSContentHash(ensName?: string | null): {
  loading: boolean;
  contenthash: string | null;
} {
  const ensNodeArgument = useMemo(() => {
    if (!ensName) return [undefined];
    try {
      return ensName ? [utils.namehash(ensName)] : [undefined];
    } catch (error) {
      return [undefined];
    }
  }, [ensName]);
  const registrarContract = useENSRegistrarContract(false);
  const resolverAddressResult = useSingleCallResult(
    registrarContract,
    "resolver",
    ensNodeArgument
  );
  const resolverAddress = resolverAddressResult.result?.[0];
  const resolverContract = useENSResolverContract(
    resolverAddress && isZero(resolverAddress) ? undefined : resolverAddress,
    false
  );
  const contenthash = useSingleCallResult(
    resolverContract,
    "contenthash",
    ensNodeArgument
  );

  return {
    contenthash: contenthash.result?.[0] ?? null,
    loading: resolverAddressResult.loading || contenthash.loading,
  };
}
