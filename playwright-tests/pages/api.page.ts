import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import dotenv from "dotenv";
import {
  graphAPIEndpoints,
  poolsExpectedDataDevApothem,
  poolsExpectedDataDevSepolia,
  poolsExpectedDataProdXDC,
} from "../test-data/api.data";
import { PoolDataApi, PoolDataExpectedApi } from "../types";
dotenv.config();

export default class APIPage {
  readonly request: APIRequestContext;
  readonly stablecoinEndpoint: string = graphAPIEndpoints.stablecoinSubgraph;
  readonly vaultEndpoint: string = graphAPIEndpoints.vaultsSubgraph;
  readonly baseUrl: string;
  readonly poolsExpectedDataArray: PoolDataExpectedApi[];

  constructor(request: APIRequestContext) {
    this.request = request;
    if (process.env.GRAPH_API_BASE_URL) {
      this.baseUrl = process.env.GRAPH_API_BASE_URL;
      switch (this.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          this.poolsExpectedDataArray = poolsExpectedDataDevApothem;
          break;
        case "https://graph.sepolia.fathom.fi":
          this.poolsExpectedDataArray = poolsExpectedDataDevSepolia;
          break;
        case "https://graph.xinfin.fathom.fi":
          this.poolsExpectedDataArray = poolsExpectedDataProdXDC;
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
          query:
            'query FxdStats($chainId: String) {\n  protocolStat(id: "fathom_stats") {\n    id\n    totalSupply\n    tvl\n    __typename\n  }\n}',
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
          query:
            "query FXDPools($chainId: String) {\n  pools {\n    rawPrice\n    collateralLastPrice\n    collateralPrice\n    debtAccumulatedRate\n    debtCeiling\n    id\n    liquidationRatio\n    lockedCollateral\n    poolName\n    priceWithSafetyMargin\n    stabilityFeeRate\n    totalAvailable\n    totalBorrowed\n    tvl\n    tokenAdapterAddress\n    __typename\n  }\n}",
          variables: {},
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

  /*
   Helpers
  */

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

  assertResponseBodyNotEmpty({ responseBody }: { responseBody: any }): void {
    expect(responseBody).not.toEqual({});
    expect(responseBody).not.toEqual([]);
    expect(responseBody).toBeTruthy();
  }
}
