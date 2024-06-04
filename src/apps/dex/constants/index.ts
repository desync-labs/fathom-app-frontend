import { ChainId, JSBI, Percent, Token, WETH } from "into-the-fathom-swap-sdk";
import {
  APOTHEM_ADDRESSES,
  XDC_ADDRESSES,
  SEPOLIA_ADDRESSES,
} from "fathom-sdk";

// a list of tokens by chain
type RouterAddressesList = {
  readonly [chainId in ChainId]: string;
};

export const ROUTER_ADDRESSES: RouterAddressesList = {
  // @todo: Need to change it after deploy to XDC
  [ChainId.XDC]: "0x7e5b4c238A904329596c4094877D48868d739963",
  [ChainId.AXDC]: "0x546F62f88cECefF9a0035156d8D456AfeEEcDe8a",
  [ChainId.SEPOLIA]: "0x73934B8E6bF6845688Dd0703c14AB54caD4972a6",
};

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

/***
 * Apothem tokens
 */
export const US_PLUS_AXDC = new Token(
  ChainId.AXDC,
  APOTHEM_ADDRESSES.xUSDT,
  6,
  "xUSDT",
  "xUSDT"
);

export const FXD_AXDC = new Token(
  ChainId.AXDC,
  APOTHEM_ADDRESSES.FXD,
  18,
  "FXD",
  "Fathom USD"
);
export const FTHM_AXDC = new Token(
  ChainId.AXDC,
  APOTHEM_ADDRESSES.FTHM_TOKEN,
  18,
  "FTHM",
  "Fathom"
);
export const WXDC_AXDC = new Token(
  ChainId.AXDC,
  APOTHEM_ADDRESSES.WXDC,
  18,
  "WXDC",
  "Wrapped XDC"
);

export const US_PLUS_XDC = new Token(
  ChainId.XDC,
  XDC_ADDRESSES.xUSDT,
  6,
  "xUSDT",
  "xUSDT"
);
export const FXD_XDC = new Token(
  ChainId.XDC,
  XDC_ADDRESSES.FXD,
  18,
  "FXD",
  "Fathom USD"
);
export const WXDC_XDC = new Token(
  ChainId.XDC,
  XDC_ADDRESSES.WXDC,
  18,
  "WXDC",
  "Wrapped XDC"
);
export const EURS_XDC = new Token(
  ChainId.XDC,
  "0x1eBb2C8a71A9ec59bF558886a8Adf8F4a565814F",
  2,
  "EURS",
  "STASIS EURS"
);
export const PLI_XDC = new Token(
  ChainId.XDC,
  "0xFf7412Ea7C8445C46a8254dFB557Ac1E48094391",
  18,
  "PLI",
  "Plugin"
);

/**
 * XDC Mainnet Tokens
 */
const FTHM_ADDRESS_XDC = XDC_ADDRESSES.FTHM_TOKEN;

export const FTHM_XDC = new Token(
  ChainId.XDC,
  FTHM_ADDRESS_XDC,
  18,
  "FTHM",
  "FTHM"
);

/**
 * Sepolia Tokens
 */
const FTHM_ADDRESS_SEPOLIA = SEPOLIA_ADDRESSES.FTHM_TOKEN;

export const FTHM_SEPOLIA = new Token(
  ChainId.SEPOLIA,
  FTHM_ADDRESS_SEPOLIA,
  18,
  "FTHM",
  "FTHM"
);

export const FTHM: { [chainId in ChainId]: Token } = {
  [ChainId.XDC]: FTHM_XDC,
  [ChainId.AXDC]: FTHM_AXDC,
  [ChainId.SEPOLIA]: FTHM_SEPOLIA,
};

const WETH_ONLY: ChainTokenList = {
  [ChainId.XDC]: [WETH[ChainId.XDC]],
  [ChainId.AXDC]: [WETH[ChainId.AXDC]],
  [ChainId.SEPOLIA]: [WETH[ChainId.SEPOLIA]],
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
    [EURS_XDC, FXD_XDC],
    [PLI_XDC, WXDC_XDC],
    [PLI_XDC, FXD_XDC],
  ],
};

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

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
// for non-expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE
); // 15%

// used to ensure the user doesn't send XDC so much, so they end up with <.01
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
