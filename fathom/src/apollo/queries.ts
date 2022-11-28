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
  query FXDPools($page: Int!) {
    pools(first: $page) {
      collatralLastPrice
      collatralPrice
      debtAccumulatedRate
      debtCeiling
      id
      liquidtionRatio
      lockedCollatral
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
  query FXDPositions($walletAddress: String!) {
    positions(
      first: 10
      orderBy: positionId
      orderDirection: desc
      where: { walletAddress: $walletAddress }
    ) {
      collatralPool
      collatralPoolName
      debtShare
      id
      liquidtionPrice
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
