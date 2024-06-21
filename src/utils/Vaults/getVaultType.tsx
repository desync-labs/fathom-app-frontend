import { VaultType } from "fathom-sdk";

const vaultType: { [key: string]: VaultType } = {};

vaultType["0xbf4adcc0a8f2c7e29f934314ce60cf5de38bfe8f".toLowerCase()] =
  VaultType.TRADEFI;

export { vaultType };
