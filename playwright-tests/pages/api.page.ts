import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import dotenv from "dotenv";
import {
  graphAPIEndpoints,
  poolsExpectedDataDevApothem,
  poolsExpectedDataDevSepolia,
  poolsExpectedDataProdXDC,
  positionsExpectedDataDevApothem,
  positionsExpectedDataDevSepolia,
  positionsExpectedDataProdXDC,
  positionsExpectedDataTwoDevApothem,
  positionsExpectedDataTwoDevSepolia,
  positionsExpectedDataTwoProdXDC,
} from "../test-data/api.data";
import {
  PoolDataApi,
  PoolDataExpectedApi,
  PositionDataApi,
  PositionDataExpectedApi,
} from "../types";
dotenv.config();

export default class APIPage {
  readonly request: APIRequestContext;
  readonly stablecoinEndpoint: string = graphAPIEndpoints.stablecoinSubgraph;
  readonly vaultEndpoint: string = graphAPIEndpoints.vaultsSubgraph;
  readonly baseUrl: string;
  readonly poolsExpectedDataArray: PoolDataExpectedApi[];
  readonly fxdStatsQuery: string = `query FxdStats($chainId: String) {\n  protocolStat(id: "fathom_stats") {\n    id\n    totalSupply\n    tvl\n    __typename\n  }\n}`;
  readonly fxdPoolsQuery: string = `query FXDPools($chainId: String) {\n  pools {\n    rawPrice\n    collateralLastPrice\n    collateralPrice\n    debtAccumulatedRate\n    debtCeiling\n    id\n    liquidationRatio\n    lockedCollateral\n    poolName\n    priceWithSafetyMargin\n    stabilityFeeRate\n    totalAvailable\n    totalBorrowed\n    tvl\n    tokenAdapterAddress\n    __typename\n  }\n}`;
  readonly fxdUserQuery: string = `query FXDUser($walletAddress: String!, $chainId: String) {\n  users(where: {address: $walletAddress}) {\n    id\n    activePositionsCount\n    __typename\n  }\n}`;
  readonly fxdPositionQuery: string = `query FXDPositions($walletAddress: String!, $first: Int!, $skip: Int!, $chainId: String) {\n  positions(\n    first: $first\n    skip: $skip\n    orderBy: positionId\n    orderDirection: desc\n    where: {walletAddress: $walletAddress, positionStatus_in: [safe, unsafe]}\n  ) {\n    id\n    collateralPool\n    collateralPoolName\n    debtShare\n    debtValue\n    lockedCollateral\n    positionAddress\n    positionId\n    positionStatus\n    safetyBuffer\n    safetyBufferInPercent\n    tvl\n    walletAddress\n    __typename\n  }\n}`;
  readonly fxdActivitiesQuery: string = `query FXDActivities($first: Int!, $proxyWallet: String!, $orderBy: String, $orderDirection: String, $chainId: String, $activityState: [String!]) {\n  positionActivities(\n    first: $first\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    where: {position_: {userAddress: $proxyWallet}, activityState_in: $activityState}\n  ) {\n    id\n    blockNumber\n    activityState\n    blockNumber\n    blockTimestamp\n    collateralAmount\n    debtAmount\n    transaction\n    position {\n      positionId\n      lockedCollateral\n      debtValue\n      debtShare\n      collateralPool\n      collateralPoolName\n      __typename\n    }\n    __typename\n  }\n}`;
  readonly vaultFactoriesQuery: string = `query VaultFactories($chainId: String) {\n  factories {\n    id\n    feeRecipient\n    protocolFee\n    timestamp\n    vaultPackage\n    vaults\n    __typename\n  }\n  accountants {\n    id\n    feeRecipient\n    performanceFee\n    timestamp\n    __typename\n  }\n}`;
  readonly vaultsQuery: string = `query Vaults($first: Int!, $skip: Int!, $shutdown: Boolean, $chainId: String) {\n  vaults(first: $first, skip: $skip, where: {shutdown: $shutdown}) {\n    id\n    token {\n      id\n      decimals\n      name\n      symbol\n      __typename\n    }\n    shareToken {\n      id\n      decimals\n      name\n      symbol\n      __typename\n    }\n    sharesSupply\n    balanceTokens\n    balanceTokensIdle\n    depositLimit\n    apr\n    shutdown\n    strategies(orderBy: activation, orderDirection: asc) {\n      id\n      delegatedAssets\n      currentDebt\n      maxDebt\n      apr\n      __typename\n    }\n    __typename\n  }\n}`;
  readonly vaultAccountDepositsQuery: string = `query VaultAccountDeposits($account: String!, $chainId: String, $first: Int, $skip: Int) {\n  deposits(\n    where: {account_contains_nocase: $account}\n    orderBy: blockNumber\n    first: $first\n    skip: $skip\n  ) {\n    id\n    timestamp\n    sharesMinted\n    tokenAmount\n    blockNumber\n    __typename\n  }\n}`;
  readonly vaultAccountWithdrawalsQuery: string = `query VaultAccountWithdrawals($account: String!, $chainId: String, $first: Int, $skip: Int) {\n  withdrawals(\n    where: {account_contains_nocase: $account}\n    orderBy: blockNumber\n    first: $first\n    skip: $skip\n  ) {\n    id\n    timestamp\n    sharesBurnt\n    tokenAmount\n    blockNumber\n    __typename\n  }\n}`;
  readonly vaultAccountVaultPositionsQuery: string = `query AccountVaultPositions($account: String!, $chainId: String, $first: Int!) {\n  accountVaultPositions(where: {account: $account}, first: $first) {\n    id\n    balancePosition\n    balanceProfit\n    balanceShares\n    balanceTokens\n    vault {\n      id\n      __typename\n    }\n    token {\n      id\n      symbol\n      name\n      __typename\n    }\n    shareToken {\n      id\n      symbol\n      name\n      __typename\n    }\n    __typename\n  }\n}`;
  readonly vaultVaultQuery: string = `query Vault($id: ID, $chainId: String) {\n  vault(id: $id) {\n    id\n    token {\n      id\n      decimals\n      name\n      symbol\n      __typename\n    }\n    shareToken {\n      id\n      decimals\n      name\n      symbol\n      __typename\n    }\n    sharesSupply\n    balanceTokens\n    balanceTokensIdle\n    depositLimit\n    apr\n    shutdown\n    strategies(orderBy: activation, orderDirection: asc) {\n      id\n      delegatedAssets\n      currentDebt\n      maxDebt\n      apr\n      __typename\n    }\n    __typename\n  }\n}`;
  readonly vaultVaultPositionTransactions: string = `query VaultPositionTransactions($account: String!, $vault: String!, $chainId: String, $first: Int) {\n  deposits(\n    where: {account_contains_nocase: $account, vault_contains_nocase: $vault}\n    first: $first\n    orderBy: blockNumber\n  ) {\n    id\n    timestamp\n    sharesMinted\n    tokenAmount\n    blockNumber\n    __typename\n  }\n  withdrawals(\n    where: {account_contains_nocase: $account, vault_contains_nocase: $vault}\n    first: $first\n    orderBy: blockNumber\n  ) {\n    id\n    timestamp\n    sharesBurnt\n    tokenAmount\n    blockNumber\n    __typename\n  }\n}`;
  readonly positionsExpectedDataArray: PositionDataExpectedApi[];
  readonly positionsExpectedDataTwoArray: PositionDataExpectedApi[];

  constructor(request: APIRequestContext) {
    this.request = request;
    if (process.env.GRAPH_API_BASE_URL) {
      this.baseUrl = process.env.GRAPH_API_BASE_URL;
      switch (this.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          this.poolsExpectedDataArray = poolsExpectedDataDevApothem;
          this.positionsExpectedDataArray = positionsExpectedDataDevApothem;
          this.positionsExpectedDataTwoArray =
            positionsExpectedDataTwoDevApothem;
          break;
        case "https://graph.sepolia.fathom.fi":
          this.poolsExpectedDataArray = poolsExpectedDataDevSepolia;
          this.positionsExpectedDataArray = positionsExpectedDataDevSepolia;
          this.positionsExpectedDataTwoArray =
            positionsExpectedDataTwoDevSepolia;
          break;
        case "https://graph.xinfin.fathom.fi":
          this.poolsExpectedDataArray = poolsExpectedDataProdXDC;
          this.positionsExpectedDataArray = positionsExpectedDataProdXDC;
          this.positionsExpectedDataTwoArray = positionsExpectedDataTwoProdXDC;
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
    } else {
      throw new Error("GRAPH_API_BASE_URL is not defined");
    }
  }

  /*
    Request Methods
  */

  async sendFxdStatsOperationRequest(): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.stablecoinEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.fxdStatsQuery,
          variables: {},
        },
      }
    );
    return response;
  }

  async sendFxdPoolsOperationRequest(): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.stablecoinEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.fxdPoolsQuery,
          variables: {},
        },
      }
    );
    return response;
  }

  async sendFxdUserOperationRequest({
    walletAddress,
  }: {
    walletAddress: string;
  }): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.stablecoinEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.fxdUserQuery,
          variables: {
            walletAddress,
          },
        },
      }
    );
    return response;
  }

  async sendFxdPositionOperationRequest({
    first,
    skip,
    walletAddress,
  }: {
    first: number;
    skip: number;
    walletAddress: string;
  }): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.stablecoinEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.fxdPositionQuery,
          variables: {
            first,
            skip,
            walletAddress,
          },
        },
      }
    );
    return response;
  }

  async sendFxdActivitiesOperationRequest({
    activityState,
    first,
    orderBy,
    orderDirection,
    proxyWallet,
  }: {
    activityState: string[];
    first: number;
    orderBy: string;
    orderDirection: string;
    proxyWallet: string;
  }): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.stablecoinEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.fxdActivitiesQuery,
          variables: {
            activityState,
            first,
            orderBy,
            orderDirection,
            proxyWallet,
          },
        },
      }
    );
    return response;
  }

  async sendVaultFactoriesOperationRequest(): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.vaultEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.vaultFactoriesQuery,
        },
      }
    );
    return response;
  }

  async sendVaultsOperationRequest({
    first,
    shutdown,
    skip,
  }: {
    first: number;
    shutdown: boolean;
    skip: number;
  }): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.vaultEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.vaultsQuery,
          variables: {
            first,
            shutdown,
            skip,
          },
        },
      }
    );
    return response;
  }

  async sendVaultAccountDepositsOperationRequest({
    account,
    first,
    skip,
  }: {
    account: string;
    first: number;
    skip: number;
  }): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.vaultEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.vaultAccountDepositsQuery,
          variables: {
            account,
            first,
            skip,
          },
        },
      }
    );
    return response;
  }

  async sendVaultAccountWithdrawalsOperationRequest({
    account,
    first,
    skip,
  }: {
    account: string;
    first: number;
    skip: number;
  }): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.vaultEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.vaultAccountWithdrawalsQuery,
          variables: {
            account,
            first,
            skip,
          },
        },
      }
    );
    return response;
  }

  async sendAccountVaultPositionsOperationRequest({
    account,
    first,
  }: {
    account: string;
    first: number;
  }): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.vaultEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.vaultAccountVaultPositionsQuery,
          variables: {
            account,
            first,
          },
        },
      }
    );
    return response;
  }

  async sendVaultOperationRequest({
    id,
  }: {
    id: string;
  }): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.vaultEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.vaultVaultQuery,
          variables: {
            id,
          },
        },
      }
    );
    return response;
  }

  async sendAccountPositionTransactionsOperationRequest({
    account,
    first,
    vault,
  }: {
    account: string;
    first: number;
    vault: string;
  }): Promise<APIResponse> {
    const response = await this.request.post(
      `${this.baseUrl}${this.vaultEndpoint}`,
      {
        headers: { "Content-Type": "application/json" },
        data: {
          query: this.vaultAccountVaultPositionsQuery,
          variables: {
            account,
            first,
            vault,
          },
        },
      }
    );
    return response;
  }

  /*
   Validation Methods
  */

  validatePoolData({
    poolData,
    expectedData,
  }: {
    poolData: PoolDataApi;
    expectedData: PoolDataExpectedApi;
  }): void {
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "rawPrice",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "collateralLastPrice",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "collateralPrice",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "debtAccumulatedRate",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "debtCeiling",
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: poolData,
      propertyName: "id",
      expectedValue: expectedData.id,
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: poolData,
      propertyName: "liquidationRatio",
      expectedValue: expectedData.liquidationRatio,
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "lockedCollateral",
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: poolData,
      propertyName: "poolName",
      expectedValue: expectedData.poolName,
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "priceWithSafetyMargin",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "rawPrice",
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: poolData,
      propertyName: "stabilityFeeRate",
      expectedValue: expectedData.stabilityFeeRate,
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: poolData,
      propertyName: "tokenAdapterAddress",
      expectedValue: expectedData.tokenAdapterAddress,
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "totalAvailable",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "totalBorrowed",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: poolData,
      propertyName: "tvl",
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: poolData,
      propertyName: "__typename",
      expectedValue: "Pool",
    });
  }

  validatePositionData({
    positionData,
    expectedData,
  }: {
    positionData: PositionDataApi;
    expectedData: PositionDataExpectedApi;
  }): void {
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: positionData,
      propertyName: "id",
      expectedValue: expectedData.id,
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: positionData,
      propertyName: "collateralPool",
      expectedValue: expectedData.collateralPool,
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: positionData,
      propertyName: "collateralPoolName",
      expectedValue: expectedData.collateralPoolName,
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: positionData,
      propertyName: "debtShare",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: positionData,
      propertyName: "debtValue",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: positionData,
      propertyName: "lockedCollateral",
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: positionData,
      propertyName: "positionAddress",
      expectedValue: expectedData.positionAddress,
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: positionData,
      propertyName: "positionId",
      expectedValue: expectedData.positionId,
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: positionData,
      propertyName: "positionStatus",
      expectedValue: expectedData.positionStatus,
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: positionData,
      propertyName: "safetyBuffer",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: positionData,
      propertyName: "tvl",
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: positionData,
      propertyName: "walletAddress",
      expectedValue: expectedData.walletAddress,
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: positionData,
      propertyName: "__typename",
      expectedValue: expectedData.__typename,
    });
  }

  validateActivityData({ activityData }: { activityData: any }): void {
    this.assertStringPropertyExists({
      parentObject: activityData,
      propertyName: "activityState",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: activityData,
      propertyName: "blockNumber",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: activityData,
      propertyName: "blockTimestamp",
    });
    this.assertStringPropertyExists({
      parentObject: activityData,
      propertyName: "collateralAmount",
    });
    this.assertStringPropertyExists({
      parentObject: activityData,
      propertyName: "debtAmount",
    });
    this.assertStringPropertyExistsAndValueContains({
      parentObject: activityData,
      propertyName: "id",
      expectedString: "position-activity-0x",
    });
    this.assertStringPropertyExists({
      parentObject: activityData,
      propertyName: "transaction",
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: activityData,
      propertyName: "__typename",
      expectedValue: "PositionActivity",
    });
    expect(activityData).toHaveProperty("position");
    this.assertStringPropertyExists({
      parentObject: activityData.position,
      propertyName: "collateralPool",
    });
    this.assertStringPropertyExists({
      parentObject: activityData.position,
      propertyName: "collateralPoolName",
    });
    this.assertStringPropertyExists({
      parentObject: activityData.position,
      propertyName: "debtShare",
    });
    this.assertStringPropertyExists({
      parentObject: activityData.position,
      propertyName: "debtValue",
    });
    this.assertStringPropertyExists({
      parentObject: activityData.position,
      propertyName: "lockedCollateral",
    });
    this.assertStringPropertyExistsAndBiggerThanZero({
      parentObject: activityData.position,
      propertyName: "positionId",
    });
    this.assertStringPropertyExistsAndValueEquals({
      parentObject: activityData.position,
      propertyName: "__typename",
      expectedValue: "Position",
    });
  }

  /*
   Helpers
  */

  assertStringPropertyExists({
    parentObject,
    propertyName,
  }: {
    parentObject: any;
    propertyName: string;
  }): void {
    expect.soft(parentObject).toHaveProperty(propertyName);
    expect.soft(typeof parentObject[`${propertyName}`]).toBe("string");
  }

  assertStringPropertyExistsAndBiggerThanZero({
    parentObject,
    propertyName,
  }: {
    parentObject: any;
    propertyName: string;
  }): void {
    expect.soft(parentObject).toHaveProperty(propertyName);
    expect.soft(typeof parentObject[`${propertyName}`]).toBe("string");
    expect.soft(Number(parentObject[`${propertyName}`])).toBeGreaterThan(0);
  }

  assertStringPropertyExistsAndValueEquals({
    parentObject,
    propertyName,
    expectedValue,
  }: {
    parentObject: any;
    propertyName: string;
    expectedValue: string;
  }): void {
    expect.soft(parentObject).toHaveProperty(propertyName);
    expect.soft(typeof parentObject[`${propertyName}`]).toBe("string");
    expect.soft(parentObject[`${propertyName}`]).toEqual(expectedValue);
  }

  assertStringPropertyExistsAndValueContains({
    parentObject,
    propertyName,
    expectedString,
  }: {
    parentObject: any;
    propertyName: string;
    expectedString: string;
  }): void {
    expect.soft(parentObject).toHaveProperty(propertyName);
    expect.soft(typeof parentObject[`${propertyName}`]).toBe("string");
    expect.soft(parentObject[`${propertyName}`]).toContain(expectedString);
  }

  assertResponseBodyNotEmpty({ responseBody }: { responseBody: any }): void {
    expect(responseBody).not.toEqual({});
    expect(responseBody).not.toEqual([]);
    expect(responseBody).toBeTruthy();
  }
}
