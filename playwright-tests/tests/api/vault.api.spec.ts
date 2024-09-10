import { qase } from "playwright-qase-reporter";
import { test, expect } from "../../fixtures/apiFixture";

let lastResponseBody: any;

test.describe("Vault Subgraph API", () => {
  test.afterEach(async () => {
    if (test.info().status !== test.info().expectedStatus) {
      console.error(
        "Test failed. Response body:",
        JSON.stringify(lastResponseBody, null, 2)
      );
    }
  });
  test(
    qase(
      84,
      "VaultFactories Operation - Query is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        const response = await apiPage.sendVaultFactoriesOperationRequest();
      });
    }
  );
});
