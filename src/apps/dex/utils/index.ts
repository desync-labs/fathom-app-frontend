import { Contract } from "@into-the-fathom/contracts";
import { getAddress } from "@into-the-fathom/address";
import { AddressZero } from "@into-the-fathom/constants";
import { JsonRpcSigner, Web3Provider } from "@into-the-fathom/providers";
import { BigNumber } from "@into-the-fathom/bignumber";
import { abi as IUniswapV2Router02ABI } from "into-the-fathom-swap-smart-contracts/artifacts/contracts/periphery/interfaces/IUniswapV2Router02.sol/IUniswapV2Router02.json";

import { ROUTER_ADDRESSES } from "apps/dex/constants";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  XDC,
  JSBI,
  Percent,
  Token,
} from "into-the-fathom-swap-sdk";
import { TokenAddressMap } from "apps/dex/state/lists/hooks";
import { toXdcAddress } from "apps/dex/utils/toXdcAddress";

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

const BLOCKSCAN_DOMAIN: { [chainId in ChainId]: string } = {
  [ChainId.XDC]: "xdc.blocksscan.io",
  [ChainId.AXDC]: "apothem.blocksscan.io",
  [ChainId.SEPOLIA]: "sepolia.etherscan.io",
};

export function getBlockScanLink(
  chainId: ChainId,
  data: string,
  type:
    | "transaction"
    | "token"
    | "address"
    | "block"
    | "transactions"
    | "tokens"
    | "blocks"
): string {
  const prefix = `https://${BLOCKSCAN_DOMAIN[chainId]}`;

  switch (type) {
    case "transaction": {
      return `${prefix}/txs/${data}`;
    }
    case "token": {
      return `${prefix}/tokens/${toXdcAddress(data)}`;
    }
    case "block": {
      return `${prefix}/blocks/${data}`;
    }
    case "address":
    default: {
      return `${prefix}/address/${toXdcAddress(data)}`;
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  let parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  parsed = toXdcAddress(parsed);
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000));
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}

export function calculateSlippageAmount(
  value: CurrencyAmount,
  slippage: number
): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  return [
    JSBI.divide(
      JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)),
      JSBI.BigInt(10000)
    ),
    JSBI.divide(
      JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)),
      JSBI.BigInt(10000)
    ),
  ];
}

// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}

// account is optional
export function getRouterContract(
  chainId: ChainId,
  library: Web3Provider,
  account?: string
): Contract {
  return getContract(
    ROUTER_ADDRESSES[chainId],
    IUniswapV2Router02ABI,
    library,
    account
  );
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function isTokenOnList(
  defaultTokens: TokenAddressMap,
  currency?: Currency
): boolean {
  if (currency === XDC) return true;
  return Boolean(
    currency instanceof Token &&
      defaultTokens[currency.chainId]?.[currency.address]
  );
}
