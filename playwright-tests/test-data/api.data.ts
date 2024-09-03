import { PoolDataExpectedApi, PositionDataExpectedApi } from "../types";

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

export const positionsExpectedDataProdXDC: PositionDataExpectedApi[] = [
  {
    id: "0x67c46f9104f447a068a8d8fb19860a1667830c44",
    collateralPool:
      "0x43474f0000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "CGO",
    positionAddress: "0x67c46f9104f447a068a8d8fb19860a1667830c44",
    positionId: "774",
    positionStatus: "safe",
    walletAddress: "0x0dc85d5bd14ea43a6a51c87d637b547da727aecc",
    __typename: "Position",
  },
  {
    id: "0x182c2a62139596ff8fa22e996c6f33c8a189872b",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0x182c2a62139596ff8fa22e996c6f33c8a189872b",
    positionId: "772",
    positionStatus: "safe",
    walletAddress: "0x0dc85d5bd14ea43a6a51c87d637b547da727aecc",
    __typename: "Position",
  },
  {
    id: "0x72c84b7771a2e77a7b2c465537dd54125525a1ae",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0x72c84b7771a2e77a7b2c465537dd54125525a1ae",
    positionId: "770",
    positionStatus: "safe",
    walletAddress: "0x0dc85d5bd14ea43a6a51c87d637b547da727aecc",
    __typename: "Position",
  },
  {
    id: "0x42efbc17f3f5dfd9f275eea7ac49a58cfe6bee04",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0x42efbc17f3f5dfd9f275eea7ac49a58cfe6bee04",
    positionId: "769",
    positionStatus: "safe",
    walletAddress: "0x0dc85d5bd14ea43a6a51c87d637b547da727aecc",
    __typename: "Position",
  },
];

export const positionsExpectedDataDevApothem: PositionDataExpectedApi[] = [
  {
    id: "0xbca69d3371acff185a9621b26b31329d158fde3a",
    collateralPool:
      "0x43474f0000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "CGO",
    positionAddress: "0xbca69d3371acff185a9621b26b31329d158fde3a",
    positionId: "3912",
    positionStatus: "safe",
    walletAddress: "0xb61ff3e131f208298948cf1a58aee7c485d138be",
    __typename: "Position",
  },
  {
    id: "0x46396ce9e2b71dd2decbbcffa8d1eea71877bea7",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0x46396ce9e2b71dd2decbbcffa8d1eea71877bea7",
    positionId: "521",
    positionStatus: "safe",
    walletAddress: "0xb61ff3e131f208298948cf1a58aee7c485d138be",
    __typename: "Position",
  },
  {
    id: "0x88048dc6a54bf50287d5ce4de3fd31d9cb3ba4da",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0x88048dc6a54bf50287d5ce4de3fd31d9cb3ba4da",
    positionId: "520",
    positionStatus: "safe",
    walletAddress: "0xb61ff3e131f208298948cf1a58aee7c485d138be",
    __typename: "Position",
  },
  {
    id: "0xbe04d900b49881d68f8394e759c12e3b34f89792",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0xbe04d900b49881d68f8394e759c12e3b34f89792",
    positionId: "519",
    positionStatus: "safe",
    walletAddress: "0xb61ff3e131f208298948cf1a58aee7c485d138be",
    __typename: "Position",
  },
];

export const positionsExpectedDataDevSepolia: PositionDataExpectedApi[] = [
  {
    id: "0x90f91131c40d19d14e284128e239204f382854f8",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0x90f91131c40d19d14e284128e239204f382854f8",
    positionId: "37",
    positionStatus: "safe",
    walletAddress: "0x1867d2b96d255922d3f640ef75c7fcf226e13447",
    __typename: "Position",
  },
  {
    id: "0xb23700df21e1ce348cbcfda5cf64d999db8dda47",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0xb23700df21e1ce348cbcfda5cf64d999db8dda47",
    positionId: "34",
    positionStatus: "safe",
    walletAddress: "0x1867d2b96d255922d3f640ef75c7fcf226e13447",
    __typename: "Position",
  },
  {
    id: "0x3a93de00f6bb4ff6f53d4d72402e1f157e175219",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0x3a93de00f6bb4ff6f53d4d72402e1f157e175219",
    positionId: "33",
    positionStatus: "safe",
    walletAddress: "0x1867d2b96d255922d3f640ef75c7fcf226e13447",
    __typename: "Position",
  },
  {
    id: "0xe5f338c628e08772d332af528a2f9a389a004b64",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0xe5f338c628e08772d332af528a2f9a389a004b64",
    positionId: "32",
    positionStatus: "safe",
    walletAddress: "0x1867d2b96d255922d3f640ef75c7fcf226e13447",
    __typename: "Position",
  },
];

export const positionsExpectedDataTwoProdXDC: PositionDataExpectedApi[] = [
  {
    id: "0xa3eae97814ff995764d2b4a674364d9cd56e6e91",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0xa3eae97814ff995764d2b4a674364d9cd56e6e91",
    positionId: "768",
    positionStatus: "safe",
    walletAddress: "0x0dc85d5bd14ea43a6a51c87d637b547da727aecc",
    __typename: "Position",
  },
];

export const positionsExpectedDataTwoDevApothem: PositionDataExpectedApi[] = [
  {
    id: "0xcb7e25cc55d846d81b98be9a59396135a96cfc3a",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0xcb7e25cc55d846d81b98be9a59396135a96cfc3a",
    positionId: "518",
    positionStatus: "safe",
    walletAddress: "0xb61ff3e131f208298948cf1a58aee7c485d138be",
    __typename: "Position",
  },
];

export const positionsExpectedDataTwoDevSepolia: PositionDataExpectedApi[] = [
  {
    id: "0xe9f4a02be46a18a3bd0d7eda00a54f634a2cef21",
    collateralPool:
      "0x5844430000000000000000000000000000000000000000000000000000000000",
    collateralPoolName: "XDC",
    positionAddress: "0xe9f4a02be46a18a3bd0d7eda00a54f634a2cef21",
    positionId: "31",
    positionStatus: "safe",
    walletAddress: "0x1867d2b96d255922d3f640ef75c7fcf226e13447",
    __typename: "Position",
  },
];
