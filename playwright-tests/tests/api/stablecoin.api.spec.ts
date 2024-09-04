import { qase } from "playwright-qase-reporter";
import { test, expect } from "../../fixtures/apiFixture";
import { PoolDataApi, PositionDataApi } from "../../types";
import { zeroAddress } from "../../test-data/api.data";

test.describe("Stablecoin Subgraph API", () => {
  test(
    qase(
      71,
      "FXDStats Operation - Querying the operation with valid inputs is successful and returns correct data"
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
      "FXDPools Operation - Querying the operation with valid inputs is successful and returns correct data"
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

  test(
    qase(
      75,
      "FXDUser Operation - Querying with a valid proxy wallet address and existing active positions is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        let walletAddress: string;
        switch (apiPage.baseUrl) {
          case "https://graph.apothem.fathom.fi":
            walletAddress = "0xb61ff3e131f208298948cf1a58aee7c485d138be";
            break;
          case "https://graph.sepolia.fathom.fi":
            walletAddress = "0x1867d2b96d255922d3f640ef75c7fcf226e13447";
            break;
          case "https://graph.xinfin.fathom.fi":
            walletAddress = "0x0dc85d5bd14ea43a6a51c87d637b547da727aecc";
            break;
          default:
            throw new Error("GRAPH_API_BASE_URL value is invalid");
        }
        const response = await apiPage.sendFxdUserOperationRequest({
          walletAddress,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("users");
        const usersArray = responseJson.data.users;
        expect(Array.isArray(usersArray)).toBe(true);
        expect(usersArray.length).toEqual(1);
        const userFirst = usersArray[0];
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "activePositionsCount",
          expectedValue: "5",
        });
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "id",
          expectedValue: walletAddress,
        });
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "__typename",
          expectedValue: "User",
        });
      });
    }
  );

  test(
    qase(
      76,
      "FXDUser Operation - Querying with a valid proxy wallet address and no active positions is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        let walletAddress: string;
        switch (apiPage.baseUrl) {
          case "https://graph.apothem.fathom.fi":
            walletAddress = "0x6ae0a2dcf10723643ba54b7c641c34dc4b1e36c2";
            break;
          case "https://graph.sepolia.fathom.fi":
            walletAddress = "0x64be63cd7f8fe5f83ed45619dd496b41e99131f1";
            break;
          case "https://graph.xinfin.fathom.fi":
            walletAddress = "0xccaf653fbfc2effc092045c104cbb669b6dfcbce";
            break;
          default:
            throw new Error("GRAPH_API_BASE_URL value is invalid");
        }
        const response = await apiPage.sendFxdUserOperationRequest({
          walletAddress,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("users");
        const usersArray = responseJson.data.users;
        expect(Array.isArray(usersArray)).toBe(true);
        expect(usersArray.length).toEqual(1);
        const userFirst = usersArray[0];
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "activePositionsCount",
          expectedValue: "0",
        });
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "id",
          expectedValue: walletAddress,
        });
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "__typename",
          expectedValue: "User",
        });
      });
    }
  );

  test(
    qase(
      77,
      "FXDUser Operation - Querying with all 0s wallet in case user has still not created a valid proxy wallet is successful and correctly returns empty data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        const response = await apiPage.sendFxdUserOperationRequest({
          walletAddress: zeroAddress,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("users");
        const usersArray = responseJson.data.users;
        expect(Array.isArray(usersArray)).toBe(true);
        expect(usersArray).toEqual([]);
      });
    }
  );

  test(
    qase(
      78,
      "FXDPositions Operation - Querying first 4 positions with skip 0 for a wallet that has 5 different positions is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        let walletAddress: string;
        switch (apiPage.baseUrl) {
          case "https://graph.apothem.fathom.fi":
            walletAddress = "0xb61ff3e131f208298948cf1a58aee7c485d138be";
            break;
          case "https://graph.sepolia.fathom.fi":
            walletAddress = "0x1867d2b96d255922d3f640ef75c7fcf226e13447";
            break;
          case "https://graph.xinfin.fathom.fi":
            walletAddress = "0x0dc85d5bd14ea43a6a51c87d637b547da727aecc";
            break;
          default:
            throw new Error("GRAPH_API_BASE_URL value is invalid");
        }
        const response = await apiPage.sendFxdPositionOperationRequest({
          walletAddress,
          first: 4,
          skip: 0,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("positions");
        const positionsArray = responseJson.data.positions;
        expect(Array.isArray(positionsArray)).toBe(true);
        expect(positionsArray.length).toEqual(4);
        // Positions' checks
        for (const positionExpectedData of apiPage.positionsExpectedDataArray) {
          const currentPoolData = positionsArray.find(
            (position: PositionDataApi) =>
              position.id === positionExpectedData.id
          );
          apiPage.validatePositionData({
            positionData: currentPoolData,
            expectedData: positionExpectedData,
          });
        }
      });
    }
  );

  test(
    qase(
      79,
      "FXDPositions Operation - Querying first 4 positions with skip 4 for a wallet that has 5 different positions is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        let walletAddress: string;
        switch (apiPage.baseUrl) {
          case "https://graph.apothem.fathom.fi":
            walletAddress = "0xb61ff3e131f208298948cf1a58aee7c485d138be";
            break;
          case "https://graph.sepolia.fathom.fi":
            walletAddress = "0x1867d2b96d255922d3f640ef75c7fcf226e13447";
            break;
          case "https://graph.xinfin.fathom.fi":
            walletAddress = "0x0dc85d5bd14ea43a6a51c87d637b547da727aecc";
            break;
          default:
            throw new Error("GRAPH_API_BASE_URL value is invalid");
        }
        const response = await apiPage.sendFxdPositionOperationRequest({
          walletAddress,
          first: 4,
          skip: 4,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("positions");
        const positionsArray = responseJson.data.positions;
        expect(Array.isArray(positionsArray)).toBe(true);
        expect(positionsArray.length).toEqual(1);
        // Positions' checks
        for (const positionExpectedData of apiPage.positionsExpectedDataTwoArray) {
          const currentPoolData = positionsArray.find(
            (position: PositionDataApi) =>
              position.id === positionExpectedData.id
          );
          apiPage.validatePositionData({
            positionData: currentPoolData,
            expectedData: positionExpectedData,
          });
        }
      });
    }
  );

  test(
    qase(
      80,
      "FXDPositions Operation - Querying first 4 positions with skip 0 for a wallet that has no positions is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        let walletAddress: string;
        switch (apiPage.baseUrl) {
          case "https://graph.apothem.fathom.fi":
            walletAddress = "0x6Ae0A2dcf10723643bA54B7C641c34Dc4B1e36C2";
            break;
          case "https://graph.sepolia.fathom.fi":
            walletAddress = "0x64be63cd7f8fe5f83ed45619dd496b41e99131f1";
            break;
          case "https://graph.xinfin.fathom.fi":
            walletAddress = "0xCcaf653FBFC2effc092045c104cBb669b6DfCbce";
            break;
          default:
            throw new Error("GRAPH_API_BASE_URL value is invalid");
        }
        const response = await apiPage.sendFxdPositionOperationRequest({
          walletAddress,
          first: 4,
          skip: 0,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("positions");
        const positionsArray = responseJson.data.positions;
        expect(Array.isArray(positionsArray)).toBe(true);
        expect(positionsArray).toEqual([]);
      });
    }
  );

  test(
    qase(
      81,
      "FXDPositions Operation - Querying first 4 positions with skip 0 for an all 0s address is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        const response = await apiPage.sendFxdPositionOperationRequest({
          walletAddress: zeroAddress,
          first: 4,
          skip: 0,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("positions");
        const positionsArray = responseJson.data.positions;
        expect(Array.isArray(positionsArray)).toBe(true);
        expect(positionsArray).toEqual([]);
      });
    }
  );

  test(
    qase(
      82,
      "FXDActivities Operation - Querying first 1000 transactions of a proxy wallet address that has at least one transaction is successful"
    ),
    async ({ apiPage }) => {
      test.setTimeout(20000);
      test.skip(
        apiPage.baseUrl === "https://graph.sepolia.fathom.fi",
        "Sepolia transactions is throwing an error currently"
      );
      await test.step("Step 1", async () => {
        let walletAddress: string;
        let expectedCount: number;
        switch (apiPage.baseUrl) {
          case "https://graph.apothem.fathom.fi":
            walletAddress = "0x79754D3bE7E04Fd671F49ae39AEbB1b1F786881B";
            expectedCount = 1000;
            break;
          case "https://graph.sepolia.fathom.fi":
            walletAddress = "0xbbc0A0F92be8bC6De8AD26422bC4b2e2c4206bc5";
            expectedCount = 1;
            break;
          case "https://graph.xinfin.fathom.fi":
            walletAddress = "0x8Bb48f8dB08b7Fa41333586415E2de5639200569";
            expectedCount = 84;
            break;
          default:
            throw new Error("GRAPH_API_BASE_URL value is invalid");
        }
        const response = await apiPage.sendFxdActivitiesOperationRequest({
          activityState: ["created", "topup", "repay", "liquidation", "closed"],
          first: 1000,
          orderBy: "blockNumber",
          orderDirection: "desc",
          proxyWallet: walletAddress,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("positionActivities");
        const positionActivitiesArray = responseJson.data.positionActivities;
        expect(Array.isArray(positionActivitiesArray)).toBe(true);
        expect(positionActivitiesArray.length).toBeGreaterThanOrEqual(
          expectedCount
        );
        for (const currentActivity of positionActivitiesArray) {
          apiPage.validateActivityData({
            activityData: currentActivity,
          });
        }
      });
    }
  );

  test(
    qase(
      83,
      "FXDActivities Operation - Querying first 1000 transactions with all 0s address is successful"
    ),
    async ({ apiPage }) => {
      test.skip(
        apiPage.baseUrl === "https://graph.sepolia.fathom.fi",
        "Sepolia transactions is throwing an error currently"
      );
      await test.step("Step 1", async () => {
        const response = await apiPage.sendFxdActivitiesOperationRequest({
          activityState: ["created", "topup", "repay", "liquidation", "closed"],
          first: 1000,
          orderBy: "blockNumber",
          orderDirection: "desc",
          proxyWallet: zeroAddress,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("positionActivities");
        const positionActivitiesArray = responseJson.data.positionActivities;
        expect(Array.isArray(positionActivitiesArray)).toBe(true);
        expect(positionActivitiesArray).toEqual([]);
      });
    }
  );
});
