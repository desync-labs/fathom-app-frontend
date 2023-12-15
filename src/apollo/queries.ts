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
      rawPrice
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
        positionStatus_in: [safe, unsafe]
      }
    ) {
      id
      collateralPool
      collateralPoolName
      debtShare
      debtValue
      lockedCollateral
      positionAddress
      positionId
      positionStatus
      safetyBuffer
      safetyBufferInPercent
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
`;

export const GOVERNANCE_PROPOSALS = gql`
  query GovernanceProposals($first: Int!, $skip: Int!) {
    proposals(
      first: $first
      skip: $skip
      orderBy: blockNumber
      orderDirection: desc
    ) {
      id
      proposalId
      proposer
      startBlock
      endBlock
      description
      forVotes
      againstVotes
      abstainVotes
      calldatas
      signatures
      values
      targets
      blockTimestamp
    }
  }
`;

export const GOVERNANCE_PROPOSAL_ITEM = gql`
  query GovernanceProposalItem($id: ID!) {
    proposal(id: $id) {
      id
      proposalId
      proposer
      startBlock
      endBlock
      blockNumber
      blockTimestamp
      description
      forVotes
      againstVotes
      abstainVotes
      calldatas
      signatures
      values
      targets
    }
  }
`;

export const GOVERNANCE_STATS = gql`
  query GovernanceStats {
    governanceStats {
      totalProposalsCount
    }
  }
`;

export const HEALTH = gql`
  query FathomHealth($name: String!) {
    indexingStatusForCurrentVersion(subgraphName: $name) {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`;

export const STAKING_PROTOCOL_STATS = gql`
  query ProtocolStats {
    protocolStats {
      id
      totalStakeFTHM
      totalVotes
      totalStakeEvents
      totalUnstakeEvents
      stakingAPR
      oneDayRewards
    }
  }
`;

export const STAKING_STAKER = gql`
  query Stakers($address: Bytes, $skip: Int, $first: Int) {
    stakers(where: { address: $address }) {
      id
      address
      totalStaked
      accruedRewards
      accruedVotes
      cooldown
      claimedAmount
      lockPositionIds
      lockPositionCount
      lockPositions(
        skip: $skip
        first: $first
        orderBy: lockId
        orderDirection: desc
      ) {
        id
        account
        streamShares
        nVoteToken
        amount
        lockId
        end
        blockNumber
        blockTimestamp
        transaction
      }
    }
  }
`;

export const STABLE_SWAP_STATS = gql`
  query StableSwapStats {
    stableSwapStats {
      remainingDailySwapAmount
    }
  }
`;

export const VAULTS = gql`
  query Vaults(
    $first: Int!
    $skip: Int!
    $search: String!
    $shutdown: Boolean
  ) {
    vaults(
      first: $first
      skip: $skip
      where: { token_: { name_contains_nocase: $search }, shutdown: $shutdown }
    ) {
      id
      token {
        id
        decimals
        name
        symbol
      }
      shareToken {
        id
        decimals
        name
        symbol
      }
      sharesSupply
      balanceTokens
      balanceTokensIdle
      totalDebtAmount
      depositLimit
      strategies {
        id
        delegatedAssets
        currentDebt
        maxDebt
        reports(orderBy: timestamp, orderDirection: desc) {
          totalFees
          protocolFees
          timestamp
          gain
          loss
          currentDebt
          results {
            apr
          }
        }
      }
    }
  }
`;

export const ACCOUNT_VAULT_POSITIONS = gql`
  query AccountVaultPositions($account: String!) {
    accountVaultPositions(where: { account: $account }) {
      id
      balancePosition
      balanceProfit
      balanceShares
      balanceTokens
      vault {
        id
      }
      token {
        symbol
        name
      }
      shareToken {
        symbol
        name
      }
    }
  }
`;
