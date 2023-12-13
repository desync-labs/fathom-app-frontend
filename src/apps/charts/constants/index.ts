export const FACTORY_ADDRESS = "0x9fAb572F75008A42c6aF80b36Ab20C76a38ABc4B";

export const BUNDLE_ID = "1";

export const timeframeOptions = {
  WEEK: "1 week",
  MONTH: "1 month",
  // THREE_MONTHS: '3 months',
  // YEAR: '1 year',
  HALF_YEAR: "6 months",
  ALL_TIME: "All time",
};

// token list urls to fetch tokens from - use for warnings on tokens and pairs
export const SUPPORTED_LIST_URLS = [
  "https://raw.githubusercontent.com/Into-the-Fathom/fathom-swap-default-token-list/main/src/tokenlists/apothem.json",
  "https://raw.githubusercontent.com/Into-the-Fathom/fathom-swap-default-token-list/main/src/tokenlists/xdc.json",
];

// hide from overview list
export const TOKEN_BLACKLIST = [
  // rebass tokens
  "0x0000000000000000000000000000000000000000",
  "0x11f4b2ae467020fb7bce8631bac27f62b869d49a", // Blue Phoenix Investments Token (BIC)
  "0xd9c714a2d98df7b3eabc3627b124ffb2d811098d", // ShibaInuXDC (ShibaX)
  "0x9ca227280599d31845dd21449b5a6acfb285b1fc", // PEPE
];

// pair blacklist
export const PAIR_BLACKLIST = [
  "0x7ce2cacc5ad4fe57453bdf0073e1a1c3e587c7c1", // WXDC-TEST
  "0x17da34c87c20846bd66baad60cccfb438989b744", // TEST-WXDC
  "0x31c9ed13088feffe9ed620d9374d63cd2a7678d8", // WXDC-PEPE
  "0xc5bdbc61e1888869cdd1433df266e0f2f31ef29e", // WXDC-ShibaX
  "0xa2e347a049ddc9d56b52b510f433ad769fcf21c9", // BIC-WXDC
];

// warnings to display if page contains info about blocked token
export const BLOCKED_WARNINGS = {
  "0x0000000000000000000000000000000000000000":
    "TikTok Inc. has asserted this token is violating its trademarks and therefore is not available.",
};

/**
 * For tokens that cause erros on fee calculations
 */
export const FEE_WARNING_TOKENS = [
  "0x0000000000000000000000000000000000000000",
];

export const UNTRACKED_COPY =
  "Derived USD values may be inaccurate without liquid stablecoin or XDC pairings.";

// pairs that should be tracked but arent due to lag in subgraph
export const TRACKED_OVERRIDES_PAIRS = [
  "0x0000000000000000000000000000000000000000",
];

// tokens that should be tracked but arent due to lag in subgraph
// all pairs that include token will be tracked
export const TRACKED_OVERRIDES_TOKENS = [
  "0x0000000000000000000000000000000000000000",
];

export const WXDC_FXD_PAIR_ID = "0x183477253b3773d0ca1d798c83e7e7572c68375b";
export const WXDC_USDT_PAIR_ID = "0xfcabba53dac7b6b19714c7d741a46f6dad260107";
export const FTHM_WXDC_PAIR_ID = "0xc923bc7eef90c9236ba356d53cd48db3de8b92c3"; // TODO: update after FTHM-FXD pair is created
