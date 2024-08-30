import { PoolDataExpectedApi } from "../types";

export const graphAPIEndpoints = {
  stablecoinSubgraph: "/subgraphs/name/stablecoin-subgraph",
  vaultsSubgraph: "/subgraphs/name/vaults-subgraph",
  daoSubgraph: "/subgraphs/name/dao-subgraph",
};

export const poolsExpectedDataProdXDC: PoolDataExpectedApi[] = [
  {
    id: "0x5844430000000000000000000000000000000000000000000000000000000000",
    liquidationRatio: "1.33",
    poolName: "XDC",
    stabilityFeeRate: "1",
    tokenAdapterAddress: "0x2fc7e65023aff27fa61a573b5c8e3fde3ce9ef79",
  },
  {
    id: "0x43474f0000000000000000000000000000000000000000000000000000000000",
    liquidationRatio: "1.176",
    poolName: "CGO",
    stabilityFeeRate: "1",
    tokenAdapterAddress: "0x30c64659aadd8c92328859a1cee99721083a8e0f",
  },
];

export const poolsExpectedDataDevApothem: PoolDataExpectedApi[] = [
  {
    id: "0x5844430000000000000000000000000000000000000000000000000000000000",
    liquidationRatio: "1.33",
    poolName: "XDC",
    stabilityFeeRate: "1",
    tokenAdapterAddress: "0x7793129ddb6de37249ef98168d989e5e2fbee76e",
  },
  {
    id: "0x43474f0000000000000000000000000000000000000000000000000000000000",
    liquidationRatio: "1.33",
    poolName: "CGO",
    stabilityFeeRate: "1",
    tokenAdapterAddress: "0xc662a1150e4b6cfe70eb4a6f2420ca761bb6bd40",
  },
];

export const poolsExpectedDataDevSepolia: PoolDataExpectedApi[] = [
  {
    id: "0x5844430000000000000000000000000000000000000000000000000000000000",
    liquidationRatio: "1.33",
    poolName: "XDC",
    stabilityFeeRate: "1",
    tokenAdapterAddress: "0xf7465fe9406add711a82b0550004e8f489b21e8a",
  },
];
