import { qase } from "playwright-qase-reporter";
import { test, expect } from "../../fixtures/apiFixture";
import { PoolDataApi } from "../../types";

test.describe("Stablecoin Subgraph API", () => {
  test(
    qase(
      71,
      "FXDStats Operation - Querying the operation with valid inputs is successful"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        const response = await apiPage.sendFxdStatsOperationRequest();
        const responseJson = await response.json();
        expect(response.status()).toEqual(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const protocolStatData = responseJson.data.protocolStat;
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: protocolStatData,
          propertyName: "id",
          expectedValue: "fathom_stats",
        });
        apiPage.assertStringPropertyExistsAndBiggerThanZero({
          parentObject: protocolStatData,
          propertyName: "totalSupply",
        });
        apiPage.assertStringPropertyExistsAndBiggerThanZero({
          parentObject: protocolStatData,
          propertyName: "tvl",
        });
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: protocolStatData,
          propertyName: "__typename",
          expectedValue: "ProtocolStat",
        });
      });
    }
  );
  test(
    qase(
      73,
      "FXDPools Operation - Querying the operation with valid inputs is successful"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        const response = await apiPage.sendFxdPoolsOperationRequest();
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("pools");
        const poolsArray = responseJson.data.pools;
        expect(Array.isArray(poolsArray)).toBe(true);
        expect(poolsArray.length).toBeGreaterThan(0);
        // Pools' checks
        for (const poolExpectedData of apiPage.poolsExpectedDataArray) {
          const currentPoolData = poolsArray.find(
            (pool: PoolDataApi) => pool.poolName === poolExpectedData.poolName
          );
          apiPage.validatePoolData({
            poolData: currentPoolData,
            expectedData: poolExpectedData,
          });
        }
      });
    }
  );
});
