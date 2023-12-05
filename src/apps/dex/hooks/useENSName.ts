import { utils } from "ethers";
import { useMemo } from "react";
import { useSingleCallResult } from "apps/dex/state/multicall/hooks";
import { isAddress } from "apps/dex/utils";
import isZero from "apps/dex/utils/isZero";
import {
  useENSRegistrarContract,
  useENSResolverContract,
} from "apps/dex/hooks/useContract";
import useDebounce from "apps/dex/hooks/useDebounce";

/**
 * Does a reverse lookup for an address to find its ENS name.
 * Note this is not the same as looking up an ENS name to find an address.
 */
export default function useENSName(address?: string): {
  ENSName: string | null;
  loading: boolean;
} {
  const debouncedAddress = useDebounce(address, 200);
  const ensNodeArgument = useMemo(() => {
    if (!debouncedAddress || !isAddress(debouncedAddress)) return [undefined];
    try {
      return debouncedAddress
        ? [
            utils.namehash(
              `${debouncedAddress.toLowerCase().substr(2)}.addr.reverse`
            ),
          ]
        : [undefined];
    } catch (error) {
      return [undefined];
    }
  }, [debouncedAddress]);
  const registrarContract = useENSRegistrarContract(false);
  const resolverAddress = useSingleCallResult(
    registrarContract,
    "resolver",
    ensNodeArgument
  );
  const resolverAddressResult = resolverAddress.result?.[0];
  const resolverContract = useENSResolverContract(
    resolverAddressResult && !isZero(resolverAddressResult)
      ? resolverAddressResult
      : undefined,
    false
  );
  const name = useSingleCallResult(resolverContract, "name", ensNodeArgument);

  const changed = debouncedAddress !== address;
  return {
    ENSName: changed ? null : name.result?.[0] ?? null,
    loading: changed || resolverAddress.loading || name.loading,
  };
}
