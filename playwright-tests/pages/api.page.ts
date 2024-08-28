import { APIRequestContext, APIResponse } from "@playwright/test";
import dotenv from "dotenv";
import { graphAPIEndpoints } from "../test-data/api.data";
dotenv.config();

export default class APIPage {
  readonly request: APIRequestContext;
  readonly stablecoinEndpoint: string = graphAPIEndpoints.stablecoinSubgraph;
  readonly vaultEndpoint: string = graphAPIEndpoints.vaultsSubgraph;
  readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    if (process.env.GRAPH_API_BASE_URL) {
      this.baseUrl = process.env.GRAPH_API_BASE_URL;
    } else {
      throw new Error("GRAPH_API_BASE_URL is not defined");
    }
  }

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
}
