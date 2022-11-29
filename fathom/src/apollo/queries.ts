import { gql } from "@apollo/client";

export const FXD_STATS = gql`
  query FxdStats {
    protocolStat(id: "fathom_stats") {
      id
      totalSupply
      tvl
    }
  }
`;

export const FXD_POOLS = gql`
  query FXDPools {
    pools {
      collateralLastPrice
      collateralPrice
      debtAccumulatedRate
      debtCeiling
      id
      liquidationRatio
      lockedCollateral
      poolName
      priceWithSafetyMargin
      stabilityFeeRate
      totalAvailable
      totalBorrowed
      tvl
      tokenAdapterAddress
    }
  }
`;

export const FXD_POSITIONS = gql`
  query FXDPositions($walletAddress: String!, $first: Int!, $skip: Int!) {
    positions(
      first: $first
      skip: $skip
      orderBy: positionId
      orderDirection: desc
      where: { 
        walletAddress: $walletAddress
        positionStatus: active
      }
    ) {
      collateralPool
      collateralPoolName
      debtShare
      id
      liquidationPrice
      lockedCollateral
      positionAddress
      positionId
      positionStatus
      safetyBuffer
      safetyBufferInPrecent
      tvl
      walletAddress
    }
  }
`;

export const FXD_USER = gql`
  query FXDUser($walletAddress: String!) {
    users(where: { address: $walletAddress }) {
      id
      activePositionsCount
    }
  }
`
