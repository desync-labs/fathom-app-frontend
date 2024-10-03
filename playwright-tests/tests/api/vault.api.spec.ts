import { qase } from "playwright-qase-reporter";
import { test, expect } from "../../fixtures/apiFixture";
import Ajv from "ajv";

let lastResponseBody: any;

test.describe("Vault Subgraph API", () => {
  const ajv = new Ajv({ allErrors: true });
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
      let factoryIdExpected: string;
      let factoryProtocolFeeExpected: number;
      let accountantIdExpected: string;
      let feeRecipientExpected: string;
      let feeRecipientAccountantExpected: string;
      let accountantPerformanceFeeExpected: string;
      switch (apiPage.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          feeRecipientExpected = "0x0eb7dee6e18cce8fe839e986502d95d47dc0ada3";
          feeRecipientAccountantExpected =
            "0x0eb7dee6e18cce8fe839e986502d95d47dc0ada3";
          factoryIdExpected = "0xe3e22410ea34661f2b7d5c13edf7b0c069bd4153";
          factoryProtocolFeeExpected = 2000;
          accountantIdExpected = "0xe732aad84ed3a55b02fbe7df10334c4d2a06afbf";
          accountantPerformanceFeeExpected = "1000";
          break;
        case "https://graph.sepolia.fathom.fi":
          feeRecipientExpected = "0x0db96eb1dc48554bb0f8203a6de449b2fccf51a6";
          feeRecipientAccountantExpected =
            "0x0db96eb1dc48554bb0f8203a6de449b2fccf51a6";
          factoryIdExpected = "0x8f323d2f3d533dd86432e1bf6b644cab84f38e8b";
          factoryProtocolFeeExpected = 2000;
          accountantIdExpected = "0x89cb2789cbd5aebb1189aa0711a544dc40586c8f";
          accountantPerformanceFeeExpected = "1000";
          break;
        case "https://graph.xinfin.fathom.fi":
          feeRecipientExpected = "0xaedb3806a395eddf45c2700ab0ab67f99c06faf4";
          feeRecipientAccountantExpected =
            "0xcb5894ed5050ff3c098944746655dbd8313b8ce5";
          factoryIdExpected = "0x0c6e3fd64d5f33eac0dccdd887a8c7512bcdb7d6";
          factoryProtocolFeeExpected = 0;
          accountantIdExpected = "0x427fd46b341c5a3e1ea19be11d36e5c526a885d4";
          accountantPerformanceFeeExpected = "1000";
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
      await test.step("Step 1", async () => {
        const response = await apiPage.sendVaultFactoriesOperationRequest();
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("factories");
        expect(responseJson.data).toHaveProperty("accountants");
        const factoryOne = responseJson.data.factories[0];
        const accountantOne = responseJson.data.accountants[0];
        apiPage.assertPropertyOfTypeExistsAndValueEquals({
          type: "string",
          parentObject: factoryOne,
          propertyName: "id",
          expectedValue: factoryIdExpected,
        });
        apiPage.assertPropertyOfTypeExistsAndValueEquals({
          type: "string",
          parentObject: factoryOne,
          propertyName: "feeRecipient",
          expectedValue: feeRecipientExpected,
        });
        apiPage.assertPropertyOfTypeExistsAndValueEquals({
          type: "number",
          parentObject: factoryOne,
          propertyName: "protocolFee",
          expectedValue: factoryProtocolFeeExpected,
        });
        apiPage.assertPropertyOfTypeExists({
          type: "string",
          parentObject: factoryOne,
          propertyName: "timestamp",
        });
        apiPage.assertPropertyOfTypeExistsAndIsAddress({
          type: "string",
          parentObject: factoryOne,
          propertyName: "vaultPackage",
        });
        expect.soft(factoryOne).toHaveProperty("vaults");
        expect.soft(Array.isArray(factoryOne.vaults)).toBeTruthy();
        expect.soft(factoryOne.vaults.length).toBeGreaterThan(0);
        apiPage.assertPropertyOfTypeExistsAndValueEquals({
          type: "string",
          parentObject: factoryOne,
          propertyName: "__typename",
          expectedValue: "Factory",
        });
        apiPage.assertPropertyOfTypeExistsAndValueEquals({
          type: "string",
          parentObject: accountantOne,
          propertyName: "id",
          expectedValue: accountantIdExpected,
        });
        apiPage.assertPropertyOfTypeExistsAndValueEquals({
          type: "string",
          parentObject: accountantOne,
          propertyName: "feeRecipient",
          expectedValue: feeRecipientAccountantExpected,
        });
        apiPage.assertPropertyOfTypeExistsAndValueEquals({
          type: "string",
          parentObject: accountantOne,
          propertyName: "performanceFee",
          expectedValue: accountantPerformanceFeeExpected,
        });
        apiPage.assertPropertyOfTypeExists({
          type: "string",
          parentObject: accountantOne,
          propertyName: "timestamp",
        });
        apiPage.assertPropertyOfTypeExistsAndValueEquals({
          type: "string",
          parentObject: accountantOne,
          propertyName: "__typename",
          expectedValue: "Accountant",
        });
      });
    }
  );

  test(
    qase(
      85,
      "Vaults Operation - Querying first 20 active vaults is successful and response body matches the valid json schema"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        const response = await apiPage.sendVaultsOperationRequest({
          first: 20,
          skip: 0,
          shutdown: false,
        });
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const valid = ajv.validate(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("../../test-data/json-schemas/vaults-active.json"),
          responseJson
        );
        if (!valid) {
          console.error("AJV Validation Errors:", ajv.errorsText());
        }
        expect(valid).toBe(true);
      });
    }
  );

  test(
    qase(
      86,
      "Vaults Operation - Querying first 20 inactive vaults is successful and response body matches the valid json schema"
    ),
    async ({ apiPage }) => {
      test.skip(
        apiPage.baseUrl === "https://graph.sepolia.fathom.fi",
        "No inactive vaults currently on Sepolia environment"
      );
      await test.step("Step 1", async () => {
        const response = await apiPage.sendVaultsOperationRequest({
          first: 20,
          skip: 0,
          shutdown: true,
        });
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const valid = ajv.validate(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("../../test-data/json-schemas/vaults-inactive.json"),
          responseJson
        );
        if (!valid) {
          console.error("AJV Validation Errors:", ajv.errorsText());
        }
        expect(valid).toBe(true);
      });
    }
  );

  test(
    qase(
      88,
      "VaultAccountDeposits Operation - Querying first 1000 deposits for an account that has at least one deposit is successful and response body matches the valid json schema"
    ),
    async ({ apiPage }) => {
      let walletAddress;
      switch (apiPage.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          walletAddress = "0xcefC4215f4F92a80ab5F2b2A8E94078A3E79b26E";
          break;
        case "https://graph.sepolia.fathom.fi":
          walletAddress = "0xcefc4215f4f92a80ab5f2b2a8e94078a3e79b26e";
          break;
        case "https://graph.xinfin.fathom.fi":
          walletAddress = "0xcdaa46858dbea6cc1b6714ef7b5bf0677e8539e0";
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
      await test.step("Step 1", async () => {
        const response = await apiPage.sendVaultAccountDepositsOperationRequest(
          {
            account: walletAddress,
            first: 1000,
            skip: 0,
          }
        );
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const valid = ajv.validate(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("../../test-data/json-schemas/vault-account-deposits.json"),
          responseJson
        );
        if (!valid) {
          console.error("AJV Validation Errors:", ajv.errorsText());
        }
        expect(valid).toBe(true);
      });
    }
  );

  test(
    qase(
      89,
      "VaultAccountDeposits Operation - Querying first 1000 deposits for an account that has no deposits is successful and returns empty deposits array"
    ),
    async ({ apiPage }) => {
      let walletAddress;
      switch (apiPage.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          walletAddress = "0x2da3B5e70695E8C56D39221aB21e628Bd47E2E31";
          break;
        case "https://graph.sepolia.fathom.fi":
          walletAddress = "0x2da3B5e70695E8C56D39221aB21e628Bd47E2E31";
          break;
        case "https://graph.xinfin.fathom.fi":
          walletAddress = "0x9b803a49118c95Ee4fE8430C13bb84BE59614ec4";
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
      await test.step("Step 1", async () => {
        const response = await apiPage.sendVaultAccountDepositsOperationRequest(
          {
            account: walletAddress,
            first: 1000,
            skip: 0,
          }
        );
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("deposits");
        expect(responseJson.data.deposits).toEqual([]);
      });
    }
  );

  test(
    qase(
      90,
      "VaultAccountWithdrawals Operation - Querying first 1000 deposits for an account that has at least one withdrawal is successful and response body matches the valid json schema"
    ),
    async ({ apiPage }) => {
      let walletAddress;
      switch (apiPage.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          walletAddress = "0xcefC4215f4F92a80ab5F2b2A8E94078A3E79b26E";
          break;
        case "https://graph.sepolia.fathom.fi":
          walletAddress = "0xcefc4215f4f92a80ab5f2b2a8e94078a3e79b26e";
          break;
        case "https://graph.xinfin.fathom.fi":
          walletAddress = "0xcdaa46858dbea6cc1b6714ef7b5bf0677e8539e0";
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
      await test.step("Step 1", async () => {
        const response =
          await apiPage.sendVaultAccountWithdrawalsOperationRequest({
            account: walletAddress,
            first: 1000,
            skip: 0,
          });
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const valid = ajv.validate(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("../../test-data/json-schemas/vault-account-withdrawals.json"),
          responseJson
        );
        if (!valid) {
          console.error("AJV Validation Errors:", ajv.errorsText());
        }
        expect(valid).toBe(true);
      });
    }
  );

  test(
    qase(
      91,
      "VaultAccountWithdrawals Operation - Querying first 1000 withdrawals for an account that has no withdrawals is successful and returns empty withdrawals array"
    ),
    async ({ apiPage }) => {
      let walletAddress;
      switch (apiPage.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          walletAddress = "0x2da3B5e70695E8C56D39221aB21e628Bd47E2E31";
          break;
        case "https://graph.sepolia.fathom.fi":
          walletAddress = "0x2da3B5e70695E8C56D39221aB21e628Bd47E2E31";
          break;
        case "https://graph.xinfin.fathom.fi":
          walletAddress = "0x9b803a49118c95Ee4fE8430C13bb84BE59614ec4";
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
      await test.step("Step 1", async () => {
        const response =
          await apiPage.sendVaultAccountWithdrawalsOperationRequest({
            account: walletAddress,
            first: 1000,
            skip: 0,
          });
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("withdrawals");
        expect(responseJson.data.withdrawals).toEqual([]);
      });
    }
  );

  test(
    qase(
      92,
      "VaultPositionTransactions Operation - Querying first 1000 transactions for an account that has at least one deposit and withdrawal and a standard vault is successful and response body matches the valid json schema"
    ),
    async ({ apiPage }) => {
      let walletAddress;
      let vaultAddress;
      switch (apiPage.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          walletAddress = "0xcefC4215f4F92a80ab5F2b2A8E94078A3E79b26E";
          vaultAddress = "0x0bd92a4749392e99df284d216ad8ec09d622a5c4";
          break;
        case "https://graph.sepolia.fathom.fi":
          walletAddress = "0xcefc4215f4f92a80ab5f2b2a8e94078a3e79b26e";
          vaultAddress = "0x775a2c63c79062a9ecb265b62cf155a7934e0b6e";
          break;
        case "https://graph.xinfin.fathom.fi":
          walletAddress = "0xcdaa46858dbea6cc1b6714ef7b5bf0677e8539e0";
          vaultAddress = "0x4dd9c4cd9a8f24a8e4d51e07ae36d6af4c4cb71b";
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
      await test.step("Step 1", async () => {
        const response =
          await apiPage.sendVaultPositionTransactionsOperationRequest({
            account: walletAddress,
            first: 1000,
            vault: vaultAddress,
          });
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const valid = ajv.validate(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("../../test-data/json-schemas/vault-position-transactions.json"),
          responseJson
        );
        if (!valid) {
          console.error("AJV Validation Errors:", ajv.errorsText());
        }
        expect(valid).toBe(true);
      });
    }
  );

  test(
    qase(
      93,
      "VaultPositionTransactions Operation - Querying first 1000 transactions for an account that has at least one deposit and withdrawal and a TradeFi type vault is successful and response body matches the valid json schema"
    ),
    async ({ apiPage }) => {
      test.skip(
        apiPage.baseUrl !== "https://graph.apothem.fathom.fi",
        "Apothem only test"
      );
      // Apothem only test
      const walletAddress = "0xcefC4215f4F92a80ab5F2b2A8E94078A3E79b26E";
      const vaultAddress = "0x8134c61a86775cf688d3d321e5cd32787c4c7f88";
      await test.step("Step 1", async () => {
        const response =
          await apiPage.sendVaultPositionTransactionsOperationRequest({
            account: walletAddress,
            first: 1000,
            vault: vaultAddress,
          });
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const valid = ajv.validate(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("../../test-data/json-schemas/vault-position-transactions.json"),
          responseJson
        );
        if (!valid) {
          console.error("AJV Validation Errors:", ajv.errorsText());
        }
        expect(valid).toBe(true);
      });
    }
  );

  test(
    qase(
      94,
      "VaultPositionTransactions Operation - Querying first 1000 transactions for an account that has no deposits and withdrawals is successful and returns empty deposits and withdrawals arrays"
    ),
    async ({ apiPage }) => {
      let walletAddress;
      let vaultAddress;
      switch (apiPage.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          walletAddress = "0x2da3B5e70695E8C56D39221aB21e628Bd47E2E31";
          vaultAddress = "0x0bd92a4749392e99df284d216ad8ec09d622a5c4";
          break;
        case "https://graph.sepolia.fathom.fi":
          walletAddress = "0x2da3B5e70695E8C56D39221aB21e628Bd47E2E31";
          vaultAddress = "0x775a2c63c79062a9ecb265b62cf155a7934e0b6e";
          break;
        case "https://graph.xinfin.fathom.fi":
          walletAddress = "0x9b803a49118c95Ee4fE8430C13bb84BE59614ec4";
          vaultAddress = "0x4dd9c4cd9a8f24a8e4d51e07ae36d6af4c4cb71b";
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
      await test.step("Step 1", async () => {
        const response =
          await apiPage.sendVaultPositionTransactionsOperationRequest({
            account: walletAddress,
            first: 1000,
            vault: vaultAddress,
          });
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("deposits");
        expect(responseJson.data.deposits).toEqual([]);
        expect(responseJson.data).toHaveProperty("withdrawals");
        expect(responseJson.data.withdrawals).toEqual([]);
      });
    }
  );

  test(
    qase(
      95,
      "Vault Operation - Querying vault operation for a valid vault id is successful and response body matches valid json schema"
    ),
    async ({ apiPage }) => {
      let vaultAddress;
      switch (apiPage.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          vaultAddress = "0x0bd92a4749392e99df284d216ad8ec09d622a5c4";
          break;
        case "https://graph.sepolia.fathom.fi":
          vaultAddress = "0x775a2c63c79062a9ecb265b62cf155a7934e0b6e";
          break;
        case "https://graph.xinfin.fathom.fi":
          vaultAddress = "0x4dd9c4cd9a8f24a8e4d51e07ae36d6af4c4cb71b";
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
      await test.step("Step 1", async () => {
        const response = await apiPage.sendVaultOperationRequest({
          id: vaultAddress,
        });
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const valid = ajv.validate(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("../../test-data/json-schemas/vault.json"),
          responseJson
        );
        if (!valid) {
          console.error("AJV Validation Errors:", ajv.errorsText());
        }
        expect(valid).toBe(true);
      });
    }
  );

  test(
    qase(
      96,
      "Account Vault Position Operation - Querying first 1000 account vault positions for an account and specific vault is successful and response body matches valid json schema"
    ),
    async ({ apiPage }) => {
      let walletAddress;
      let vaultAddress;
      switch (apiPage.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          walletAddress = "0xcefc4215f4f92a80ab5f2b2a8e94078a3e79b26e";
          vaultAddress = "0x0bd92a4749392e99df284d216ad8ec09d622a5c4";
          break;
        case "https://graph.sepolia.fathom.fi":
          walletAddress = "0xcefc4215f4f92a80ab5f2b2a8e94078a3e79b26e";
          vaultAddress = "0x775a2c63c79062a9ecb265b62cf155a7934e0b6e";
          break;
        case "https://graph.xinfin.fathom.fi":
          walletAddress = "0xcdaa46858dbea6cc1b6714ef7b5bf0677e8539e0";
          vaultAddress = "0x4dd9c4cd9a8f24a8e4d51e07ae36d6af4c4cb71b";
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
      await test.step("Step 1", async () => {
        const response =
          await apiPage.sendAccountVaultPositionsOperationRequest({
            account: walletAddress,
            first: 1000,
            vault: vaultAddress,
          });
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const valid = ajv.validate(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("../../test-data/json-schemas/account-vault-positions.json"),
          responseJson
        );
        if (!valid) {
          console.error("AJV Validation Errors:", ajv.errorsText());
        }
        expect(valid).toBe(true);
      });
    }
  );

  test(
    qase(
      97,
      "Account Vault Position Operation - Querying first 1000 account vault positions for an account is successful and response body matches valid json schema"
    ),
    async ({ apiPage }) => {
      let walletAddress;
      switch (apiPage.baseUrl) {
        case "https://graph.apothem.fathom.fi":
          walletAddress = "0xcefc4215f4f92a80ab5f2b2a8e94078a3e79b26e";
          break;
        case "https://graph.sepolia.fathom.fi":
          walletAddress = "0xcefc4215f4f92a80ab5f2b2a8e94078a3e79b26e";
          break;
        case "https://graph.xinfin.fathom.fi":
          walletAddress = "0xcdaa46858dbea6cc1b6714ef7b5bf0677e8539e0";
          break;
        default:
          throw new Error("GRAPH_API_BASE_URL value is invalid");
      }
      await test.step("Step 1", async () => {
        const response =
          await apiPage.sendAccountVaultPositionsOperationRequest({
            account: walletAddress,
            first: 1000,
          });
        const responseJson = await response.json();
        lastResponseBody = responseJson;
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const valid = ajv.validate(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("../../test-data/json-schemas/account-vault-positions.json"),
          responseJson
        );
        if (!valid) {
          console.error("AJV Validation Errors:", ajv.errorsText());
        }
        expect(valid).toBe(true);
      });
    }
  );
});
