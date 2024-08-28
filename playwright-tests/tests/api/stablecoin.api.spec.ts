import { qase } from "playwright-qase-reporter";
import { test, expect } from "../../fixtures/apiFixture";

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
        expect(response.status()).toBe(200);
        expect.soft(responseJson.data.protocolStat.id).toEqual("fathom_stats");
        expect
          .soft(Number(responseJson.data.protocolStat.totalSupply))
          .toBeGreaterThan(0);
        expect
          .soft(Number(responseJson.data.protocolStat.tvl))
          .toBeGreaterThan(0);
        expect
          .soft(responseJson.data.protocolStat.__typename)
          .toEqual("ProtocolStat");
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
        // TO DO
      });
    }
  );
});
