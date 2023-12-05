import { ChainId, JSBI, Percent, Token, WETH } from "into-the-fathom-swap-sdk";
import { AbstractConnector } from "@web3-react/abstract-connector";

import { injected } from "apps/dex/connectors";

// a list of tokens by chain
type RouterAddressesList = {
  readonly [chainId in ChainId]: string;
};

export const ROUTER_ADDRESSES: RouterAddressesList = {
  // @todo: Need to change it after deploy to XDC
  [ChainId.XDC]: "0x7e5b4c238A904329596c4094877D48868d739963",
  [ChainId.AXDC]: "0x546F62f88cECefF9a0035156d8D456AfeEEcDe8a",
};

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13;
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320;

export const GOVERNANCE_ADDRESS = "0x0000000000000000000000000000000000000000";

export const TIMELOCK_ADDRESS = "0x0000000000000000000000000000000000000000";

/***
 * Apothem tokens
 */
export const US_PLUS_AXDC = new Token(
  ChainId.AXDC,
  "0x82b4334F5CD8385f55969BAE0A863a0C6eA9F63f",
  6,
  "xUSDT",
  "xUSDT"
);

export const FXD_AXDC = new Token(
  ChainId.AXDC,
  "0xa585BF9418C6Aca0a46d308Cea3b2EC85046C88F",
  18,
  "FXD",
  "Fathom USD"
);
export const FTHM_AXDC = new Token(
  ChainId.AXDC,
  "0x764687eA66dCaf68Fb5246C29739221cfef3Bb46",
  18,
  "FTHM",
  "Fathom"
);
export const WXDC_AXDC = new Token(
  ChainId.AXDC,
  "0xE99500AB4A413164DA49Af83B9824749059b46ce",
  18,
  "WXDC",
  "Wrapped XDC"
);

export const US_PLUS_XDC = new Token(
  ChainId.XDC,
  "0xD4B5f10D61916Bd6E0860144a91Ac658dE8a1437",
  6,
  "xUSDT",
  "xUSDT"
);
export const FXD_XDC = new Token(
  ChainId.XDC,
  "0x45B3adfBEc2ce6D5D407420B4eAEE9e80Ab447e2",
  18,
  "FXD",
  "Fathom USD"
);
export const WXDC_XDC = new Token(
  ChainId.XDC,
  "0x951857744785e80e2de051c32ee7b25f9c458c42",
  18,
  "WXDC",
  "Wrapped XDC"
);

/**
 * XDC Mainnet Tokens
 */
const FTHM_ADDRESS_XDC = "0x3279dBEfABF3C6ac29d7ff24A6c46645f3F4403c";

export const FTHM_XDC = new Token(
  ChainId.XDC,
  FTHM_ADDRESS_XDC,
  18,
  "FTHM",
  "FTHM"
);

export const FTHM: { [chainId in ChainId]: Token } = {
  [ChainId.XDC]: FTHM_XDC,
  [ChainId.AXDC]: FTHM_AXDC,
};

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [FTHM_ADDRESS_XDC]: "FTHM",
  [GOVERNANCE_ADDRESS]: "Governance",
  [TIMELOCK_ADDRESS]: "Timelock",
};

const WETH_ONLY: ChainTokenList = {
  [ChainId.XDC]: [WETH[ChainId.XDC]],
  [ChainId.AXDC]: [WETH[ChainId.AXDC]],
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
};

export const ADDITIONAL_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
} = {};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
} = {};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
};

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][];
} = {
  [ChainId.AXDC]: [
    [US_PLUS_AXDC, FTHM_AXDC],
    [FXD_AXDC, FTHM_AXDC],
    [FXD_AXDC, US_PLUS_AXDC],
    [WXDC_AXDC, FTHM_AXDC],
    [FXD_AXDC, WXDC_AXDC],
    [WXDC_AXDC, US_PLUS_AXDC],
  ],
  [ChainId.XDC]: [
    [US_PLUS_XDC, FTHM_XDC],
    [FXD_XDC, FTHM_XDC],
    [FXD_XDC, US_PLUS_XDC],
    [WXDC_XDC, FTHM_XDC],
    [FXD_XDC, WXDC_XDC],
    [WXDC_XDC, US_PLUS_XDC],
  ],
};

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    iconName: "metamask.png",
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
};

export const NetworkContextName = "NETWORK";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7);

export const BIG_INT_ZERO = JSBI.BigInt(0);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE
); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(300),
  BIPS_BASE
); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE
); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE
); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE
); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_XDC: JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(16)
); // .01 XDC
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(
  JSBI.BigInt(50),
  JSBI.BigInt(10000)
);

export const ZERO_PERCENT = new Percent("0");
export const ONE_HUNDRED_PERCENT = new Percent("1");

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  "0x0000000000000000000000000000000000000000",
];
