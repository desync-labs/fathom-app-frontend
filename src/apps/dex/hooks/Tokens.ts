import {
  TokenAddressMap,
  useSupportedTokenList,
} from "apps/dex/state/lists/hooks";
import { parseBytes32String } from "@into-the-fathom/strings";
import { Currency, currencyEquals, Token, XDC } from "into-the-fathom-swap-sdk";
import { useMemo } from "react";
import {
  useCombinedActiveList,
  useCombinedInactiveList,
} from "apps/dex/state/lists/hooks";
import {
  NEVER_RELOAD,
  useSingleCallResult,
} from "apps/dex/state/multicall/hooks";
import { useUserAddedTokens } from "apps/dex/state/user/hooks";
import { isAddress } from "apps/dex/utils";

import { useActiveWeb3React } from "apps/dex/hooks";
import {
  useBytes32TokenContract,
  useTokenContract,
} from "apps/dex/hooks/useContract";
import { filterTokens } from "apps/dex/components/SearchModal/filtering";
import { utils } from "fathom-ethers";
import { useServices } from "context/services";
import { ChainId } from "connectors/networks";

// reduce a token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(
  tokenMap: TokenAddressMap,
  includeUserAdded: boolean
): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React();
  const userAddedTokens = useUserAddedTokens();
  const { chainId: servicesChainId } = useServices();

  return useMemo(() => {
    const checkedChainId = (
      tokenMap[chainId] ? chainId : servicesChainId
    ) as ChainId;

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[checkedChainId]).reduce<{
      [address: string]: Token;
    }>((newMap, address) => {
      newMap[address] = tokenMap[checkedChainId][address].token;
      return newMap;
    }, {});

    if (includeUserAdded) {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: Token }>(
            (tokenMap, token) => {
              tokenMap[token.address] = token;
              return tokenMap;
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      );
    }

    return mapWithoutUrls;
  }, [chainId, servicesChainId, userAddedTokens, tokenMap, includeUserAdded]);
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedActiveList();
  return useTokensFromMap(allTokens, true);
}

export function useAllInactiveTokens(): { [address: string]: Token } {
  // get inactive tokens
  const inactiveTokensMap = useCombinedInactiveList();
  const inactiveTokens = useTokensFromMap(inactiveTokensMap, false);

  // filter out any token on active list
  const activeTokensAddresses = Object.keys(useAllTokens());
  return activeTokensAddresses
    ? Object.keys(inactiveTokens).reduce<{ [address: string]: Token }>(
        (newMap, address) => {
          if (!activeTokensAddresses.includes(address)) {
            newMap[address] = inactiveTokens[address];
          }
          return newMap;
        },
        {}
      )
    : inactiveTokens;
}

export function useSupportedTokens(): { [address: string]: Token } {
  const supportedTokensMap = useSupportedTokenList();
  return useTokensFromMap(supportedTokensMap, false);
}

export function useIsTokenActive(token: Token | undefined | null): boolean {
  const activeTokens = useAllTokens();

  if (!activeTokens || !token) {
    return false;
  }

  return !!activeTokens[token.address];
}

// used to detect extra search results
export function useFoundOnInactiveList(
  searchQuery: string
): Token[] | undefined {
  const { chainId } = useActiveWeb3React();
  const inactiveTokens = useAllInactiveTokens();

  return useMemo(() => {
    if (!chainId || searchQuery === "") {
      return undefined;
    } else {
      return filterTokens(Object.values(inactiveTokens), searchQuery);
    }
  }, [chainId, inactiveTokens, searchQuery]);
}

// Check if currency is included in a custom list from user storage
export function useIsUserAddedToken(
  currency: Currency | undefined | null
): boolean {
  const userAddedTokens = useUserAddedTokens();

  if (!currency) {
    return false;
  }

  return !!userAddedTokens.find((token) => currencyEquals(currency, token));
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

function parseStringOrBytes32(
  str: string | undefined,
  bytes32: string | undefined,
  defaultValue: string
): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && utils.arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue;
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React();
  const tokens = useAllTokens();

  const address = isAddress(tokenAddress);

  const tokenContract = useTokenContract(address ? address : undefined, false);
  const tokenContractBytes32 = useBytes32TokenContract(
    address ? address : undefined,
    false
  );
  const token: Token | undefined = address ? tokens[address] : undefined;

  const tokenName = useSingleCallResult(
    token ? undefined : tokenContract,
    "name",
    undefined,
    NEVER_RELOAD
  );
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    "name",
    undefined,
    NEVER_RELOAD
  );
  const symbol = useSingleCallResult(
    token ? undefined : tokenContract,
    "symbol",
    undefined,
    NEVER_RELOAD
  );
  const symbolBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    "symbol",
    undefined,
    NEVER_RELOAD
  );
  const decimals = useSingleCallResult(
    token ? undefined : tokenContract,
    "decimals",
    undefined,
    NEVER_RELOAD
  );

  return useMemo(() => {
    if (token) return token;
    if (!chainId || !address) return undefined;
    if (decimals.loading || symbol.loading || tokenName.loading) return null;
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(
          symbol.result?.[0],
          symbolBytes32.result?.[0],
          "UNKNOWN"
        ),
        parseStringOrBytes32(
          tokenName.result?.[0],
          tokenNameBytes32.result?.[0],
          "Unknown Token"
        )
      );
    }
    return undefined;
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ]);
}

export function useCurrency(
  currencyId: string | undefined
): Currency | null | undefined {
  const isXDC = currencyId?.toUpperCase() === "XDC";
  const token = useToken(isXDC ? undefined : currencyId);
  return isXDC ? XDC : token;
}
