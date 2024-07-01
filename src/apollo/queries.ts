import { gql } from "@apollo/client";

export const FXD_STATS = gql`
  query FxdStats($chainId: String) {
    protocolStat(id: "fathom_stats") {
      id
      totalSupply
      tvl
    }
  }
`;

export const FXD_POOLS = gql`
  query FXDPools($chainId: String) {
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
  query FXDPositions(
    $walletAddress: String!
    $first: Int!
    $skip: Int!
    $chainId: String
  ) {
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
  query FXDUser($walletAddress: String!, $chainId: String) {
    users(where: { address: $walletAddress }) {
      id
      activePositionsCount
    }
  }
`;

export const FXD_ACTIVITIES = gql`
  query FXDActivities(
    $first: Int!
    $proxyWallet: String!
    $orderBy: String
    $orderDirection: String
    $chainId: String
    $activityState: [String!]
  ) {
    positionActivities(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: {
        position_: { userAddress: $proxyWallet }
        activityState_in: $activityState
      }
    ) {
      id
      blockNumber
      activityState
      blockNumber
      blockTimestamp
      collateralAmount
      debtAmount
      transaction
      position {
        positionId
        lockedCollateral
        debtValue
        debtShare
        collateralPool
        collateralPoolName
      }
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
  query FathomHealth($name: String!, $chainId: String) {
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

/**
 * Vault queries
 */
export const VAULTS = gql`
  query Vaults(
    $first: Int!
    $skip: Int!
    $shutdown: Boolean
    $chainId: String
  ) {
    vaults(first: $first, skip: $skip, where: { shutdown: $shutdown }) {
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
      depositLimit
      apr
      shutdown
      strategies(orderBy: activation, orderDirection: asc) {
        id
        delegatedAssets
        currentDebt
        maxDebt
        apr
      }
    }
  }
`;
export const VAULT = gql`
  query Vault($id: ID, $chainId: String) {
    vault(id: $id) {
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
      depositLimit
      apr
      shutdown
      strategies(orderBy: activation, orderDirection: asc) {
        id
        delegatedAssets
        currentDebt
        maxDebt
        apr
      }
    }
  }
`;

export const VAULT_POSITION = gql`
  query AccountVaultPositions(
    $account: String!
    $vault: String!
    $chainId: String
  ) {
    accountVaultPositions(where: { account: $account, vault: $vault }) {
      id
      balancePosition
      balanceProfit
      balanceShares
      balanceTokens
      vault {
        id
      }
      token {
        id
        symbol
        name
      }
      shareToken {
        id
        symbol
        name
      }
    }
  }
`;

export const VAULT_STRATEGY_REPORTS = gql`
  query VaultStrategyReports(
    $strategy: String!
    $reportsFirst: Int
    $reportsSkip: Int
    $chainId: String
  ) {
    strategyHistoricalAprs(
      first: $reportsFirst
      skip: $reportsSkip
      where: { strategy: $strategy }
    ) {
      id
      apr
      timestamp
    }
    strategyReports(
      orderBy: timestamp
      orderDirection: desc
      first: $reportsFirst
      skip: $reportsSkip
      where: { strategy: $strategy }
    ) {
      id
      timestamp
      gain
      loss
      currentDebt
    }
  }
`;

export const ACCOUNT_VAULT_POSITIONS = gql`
  query AccountVaultPositions(
    $account: String!
    $chainId: String
    $first: Int!
  ) {
    accountVaultPositions(where: { account: $account }, first: $first) {
      id
      balancePosition
      balanceProfit
      balanceShares
      balanceTokens
      vault {
        id
      }
      token {
        id
        symbol
        name
      }
      shareToken {
        id
        symbol
        name
      }
    }
  }
`;

export const VAULT_FACTORIES = gql`
  query VaultFactories($chainId: String) {
    factories {
      id
      feeRecipient
      protocolFee
      timestamp
      vaultPackage
      vaults
    }
    accountants {
      id
      feeRecipient
      performanceFee
      timestamp
    }
  }
`;

export const VAULT_POSITION_TRANSACTIONS = gql`
  query VaultPositionTransactions(
    $account: String!
    $vault: String!
    $chainId: String
    $first: Int
  ) {
    deposits(
      where: {
        account_contains_nocase: $account
        vault_contains_nocase: $vault
      }
      first: $first
      orderBy: blockNumber
    ) {
      id
      timestamp
      sharesMinted
      tokenAmount
      blockNumber
    }
    withdrawals(
      where: {
        account_contains_nocase: $account
        vault_contains_nocase: $vault
      }
      first: $first
      orderBy: blockNumber
    ) {
      id
      timestamp
      sharesBurnt
      tokenAmount
      blockNumber
    }
  }
`;

export const VAULTS_ACCOUNT_DEPOSITS = gql`
  query VaultAccountDeposits(
    $account: String!
    $chainId: String
    $first: Int
    $skip: Int
  ) {
    deposits(
      where: { account_contains_nocase: $account }
      orderBy: blockNumber
      first: $first
      skip: $skip
    ) {
      id
      timestamp
      sharesMinted
      tokenAmount
      blockNumber
    }
  }
`;

export const VAULTS_ACCOUNT_WITHDRAWALS = gql`
  query VaultAccountWithdrawals(
    $account: String!
    $chainId: String
    $first: Int
    $skip: Int
  ) {
    withdrawals(
      where: { account_contains_nocase: $account }
      orderBy: blockNumber
      first: $first
      skip: $skip
    ) {
      id
      timestamp
      sharesBurnt
      tokenAmount
      blockNumber
    }
  }
`;
