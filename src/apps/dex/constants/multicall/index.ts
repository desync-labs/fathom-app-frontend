import { ChainId } from "into-the-fathom-swap-sdk";
import MULTICALL_ABI from "apps/dex/constants/multicall/abi.json";

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.XDC]: "0xeDA95e2B6BA4196A428Dc824B4fBd8f6dd39E518",
  [ChainId.AXDC]: "0x09F50aE0776519a056349352F2A03Df1bDE393A7",
  [ChainId.SEPOLIA]: "0xc786c0A75acd6f0752ca256E27a094B8ba068465",
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
