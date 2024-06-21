import { VaultType } from "fathom-sdk";

const vaultType: { [key: string]: VaultType } = {};

vaultType["0xfa6ed4d32110e1c27c9d8c2930e217746cb8acab".toLowerCase()] =
  VaultType.TRADEFI;
vaultType["0xbf4adcc0a8f2c7e29f934314ce60cf5de38bfe8f".toLowerCase()] =
  VaultType.TRADEFI;
vaultType["0x2D8A913F47B905C71F0A3d387de863F3a1Cc8d78".toLowerCase()] =
  VaultType.TRADEFI;
vaultType["0xA6272625f8fCd6FC3b53A167E471b7D55095a40b".toLowerCase()] =
  VaultType.TRADEFI;

export { vaultType };
