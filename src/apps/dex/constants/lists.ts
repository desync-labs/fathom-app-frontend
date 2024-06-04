// used to mark supported tokens, these are hosted lists of supported tokens
export const SUPPORTED_LIST_URLS: string[] = [
  "https://raw.githubusercontent.com/Into-the-Fathom/fathom-swap-default-token-list/main/src/tokenlists/apothem.json",
  "https://raw.githubusercontent.com/Into-the-Fathom/fathom-swap-default-token-list/main/src/tokenlists/xdc.json",
  "https://raw.githubusercontent.com/Into-the-Fathom/fathom-swap-default-token-list/main/src/tokenlists/sepolia.json",
];

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [...SUPPORTED_LIST_URLS];

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [];
