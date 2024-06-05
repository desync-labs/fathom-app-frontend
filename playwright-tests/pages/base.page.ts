import {
  type Page,
  type Locator,
  expect,
  type Request,
} from "@playwright/test";
import dotenv from "dotenv";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import {
  type AvailableNetworks,
  type GraphOperationName,
  type WalletConnectOptions,
} from "../types";
import { ethers } from "fathom-ethers";
import FathomStablecoin from "../fixtures/abis/FathomStablecoin.json";
import { contractAddresses } from "../fixtures/global.data";
import {
  APOTHEM_RPC,
  SEPOLIA_RPC,
  XDC_RPC,
} from "../../src/connectors/networks";
dotenv.config();

export default class BasePage {
  readonly page: Page;
  readonly btnWalletIcon: Locator;
  readonly divConnectedWalletAddress: Locator;
  readonly btnExit: Locator;
  readonly imgMetamask: Locator;
  readonly divNetworkHeader: Locator;
  readonly graphAPIBaseUrl: string;
  readonly divAlert: Locator;
  readonly divAlertMessage: Locator;
  readonly divAlertTitle: Locator;
  readonly paragraphAlertBody: Locator;
  readonly timeoutTransactionPending = process.env.CI ? 90000 : 60000;
  readonly privateKeyMainAccount: string;
  readonly rpcURL: string;

  constructor(page: Page) {
    this.page = page;

    switch (process.env.CHAIN) {
      case "xdc_mainnet":
        this.graphAPIBaseUrl = "https://xinfin-graph.fathom.fi";
        this.rpcURL = XDC_RPC;
        break;
      case "apothem":
        this.graphAPIBaseUrl = "https://dev-graph.fathom.fi";
        this.rpcURL = APOTHEM_RPC;
        break;
      case "sepolia":
        this.graphAPIBaseUrl = "https://graph.sepolia.fathom.fi";
        this.rpcURL = SEPOLIA_RPC;
        break;
      default:
        this.graphAPIBaseUrl = "https://dev-graph.fathom.fi";
        this.rpcURL = APOTHEM_RPC;
    }

    if (process.env.METAMASK_SETUP_PRIVATE_KEY) {
      this.privateKeyMainAccount = process.env.METAMASK_SETUP_PRIVATE_KEY;
    } else {
      throw new Error("METAMASK_SETUP_PRIVATE_KEY env variable is missing");
    }

    // Locators
    this.btnWalletIcon = this.page.locator(
      'header [data-testid="AccountBalanceWalletIcon"]'
    );
    this.divConnectedWalletAddress = this.page.locator(
      '//div[contains(text(), "0x") and contains(text(), "…")]'
    );
    this.btnExit = this.page.locator('button:has(img[alt="exit"])');
    this.imgMetamask = this.page.locator('img[alt="metamask"]');
    this.divNetworkHeader = this.page.locator('//img[@alt="xdc"]//parent::div');
    this.divAlert = this.page.locator('div[role="alert"]');
    this.divAlertMessage = this.page.locator(".MuiAlert-message");
    this.divAlertTitle = this.divAlertMessage.locator("> .MuiAlertTitle-root");
    this.paragraphAlertBody = this.divAlertMessage.locator("> p");
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async connectWallet(
    wallet: WalletConnectOptions,
    options?: { allAccounts: boolean }
  ): Promise<void> {
    await this.btnWalletIcon.click();
    await this.page.getByText(wallet).click();
    if (options) {
      await metamask.acceptAccess(options);
    } else {
      await metamask.acceptAccess();
    }
  }

  async disconnectWallet(): Promise<void> {
    await this.btnExit.click();
  }

  async getConnectedWalletAddressFromHeader(): Promise<string> {
    const walletAddress = await this.divConnectedWalletAddress.textContent();
    if (walletAddress !== null) {
      return walletAddress;
    } else {
      throw Error("Could not get wallet address");
    }
  }

  async validateConnectedWalletAddress(): Promise<void> {
    const walletAddressHeader =
      await this.getConnectedWalletAddressFromHeader();
    const connectedAddressMetamask = await metamask.getWalletAddress();
    expect(connectedAddressMetamask).toContain(
      walletAddressHeader?.substring(0, 6)
    );
    expect(connectedAddressMetamask).toContain(
      walletAddressHeader?.substring(
        walletAddressHeader.length - 4,
        walletAddressHeader.length
      )
    );
  }

  async validateExitButton(): Promise<void> {
    await expect(this.btnExit).toBeVisible();
    await expect.soft(this.btnExit).toBeEnabled();
    expect
      .soft(await this.btnExit.locator("img").getAttribute("src"))
      .toContain("exit");
    expect
      .soft(await this.btnExit.locator("img").getAttribute("src"))
      .toContain(".svg");
  }

  async validateMetamaskLogo(): Promise<void> {
    await expect(this.imgMetamask).toBeVisible();
    expect
      .soft(await this.imgMetamask.getAttribute("src"))
      .toContain("metamask");
    expect.soft(await this.imgMetamask.getAttribute("src")).toContain(".svg");
  }

  async validateNetworkBlock(
    connectedNetworkName: AvailableNetworks
  ): Promise<void> {
    await expect(this.divNetworkHeader).toBeVisible();
    await expect.soft(this.divNetworkHeader).toHaveText(connectedNetworkName);
    await expect.soft(this.divNetworkHeader.locator("img")).toBeVisible();
    expect
      .soft(await this.divNetworkHeader.locator("img").getAttribute("src"))
      .toContain("logo.png");
  }

  async validateWalletDisconnected(): Promise<void> {
    await expect.soft(this.btnWalletIcon).toBeVisible();
    await expect.soft(this.divConnectedWalletAddress).not.toBeVisible();
    await expect.soft(this.divNetworkHeader).not.toBeVisible();
  }

  async waitForGraphRequestByOperationName(
    endpoint: string,
    operationName: GraphOperationName
  ): Promise<Request> {
    const request = await this.page.waitForRequest(
      (request) => {
        const includesFxdPositions = request
          .postData()
          ?.includes(operationName);
        if (includesFxdPositions !== undefined) {
          return (
            request.url() === `${this.graphAPIBaseUrl}${endpoint}` &&
            includesFxdPositions
          );
        } else {
          return false;
        }
      },
      { timeout: this.timeoutTransactionPending }
    );
    return request;
  }

  async validateAlertMessage({
    status,
    title,
    body,
  }: {
    status: "pending" | "success" | "error";
    title: string;
    body?: string;
  }): Promise<void> {
    if (status === "pending") {
      await expect
        .soft(this.divAlertMessage.getByText(title))
        .toBeVisible({ timeout: this.timeoutTransactionPending });
      if (body) {
        await expect
          .soft(this.divAlertMessage.getByText(body))
          .toBeVisible({ timeout: this.timeoutTransactionPending });
      }
    } else if (status === "success" || status === "error") {
      await expect
        .soft(this.divAlert.getByText(title))
        .toBeVisible({ timeout: this.timeoutTransactionPending });
    }
  }

  async mintVaultsStableCoinToAddress(
    address: string,
    amount: number
  ): Promise<void> {
    const rpcUrl = this.rpcURL;
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(this.privateKeyMainAccount, provider);
    const signer = wallet.connect(provider);
    const fathomStablecoinContractAddress =
      contractAddresses.fathomStablecoinVaults;
    const fathomStablecoinContractAbi = FathomStablecoin.abi;
    const fathomStablecoinContract = new ethers.Contract(
      fathomStablecoinContractAddress,
      fathomStablecoinContractAbi,
      signer
    );
    const amountFormatted = BigInt(
      Math.ceil(amount).toString() + "000000000000000000"
    );
    const transaction = await fathomStablecoinContract.mint(
      address,
      amountFormatted
    );
    const receipt = await transaction.wait();
    expect(receipt.status).toEqual(1);
  }

  async transferTestNativeTokenToAddress(
    address: string,
    amountToSend: number
  ): Promise<void> {
    const senderPrivateKey = this.privateKeyMainAccount;
    const receiverAddress = address;
    const rpcUrl = this.rpcURL;
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
    const tokenAmount = ethers.utils.parseEther(amountToSend.toString());
    const gasLimit = 200000;
    const transactionData = {
      to: receiverAddress,
      value: tokenAmount,
      gasLimit: ethers.BigNumber.from(gasLimit),
    };
    const transaction = await senderWallet.sendTransaction(transactionData);
    const receipt = await transaction.wait();
    expect(receipt.status).toEqual(1);
  }
}
