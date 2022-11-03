import { SmartContractFactory } from "config/SmartContractFactory";
import IPositionService from "services/interfaces/IPositionService";
import { Constants } from "helpers/Constants";
import { Web3Utils } from "helpers/Web3Utils";
import OpenPosition from "stores/interfaces/IOpenPosition";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import BigNumber from "bignumber.js";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import ActiveWeb3Transactions from "stores/transaction.store";
import {
  TransactionStatus,
  TransactionType,
} from "../stores/interfaces/ITransaction";
import { Strings } from "../helpers/Strings";

import { toWei } from "web3-utils";

export default class PositionService implements IPositionService {
  chainId = Constants.DEFAULT_CHAINID;

  async openPosition(
    address: string,
    pool: ICollateralPool,
    collateral: number,
    fathomToken: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    try {
      let proxyWalletAddress = await this.proxyWalletExist(address);

      if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
        console.log("Proxy wallet not exist...");
        proxyWalletAddress = await this.createProxyWallet(address);
      }

      console.log(`Open position for proxy wallet ${proxyWalletAddress}...`);

      const wallet = Web3Utils.getContractInstanceFrom(
        SmartContractFactory.proxyWallet.abi,
        proxyWalletAddress,
        this.chainId
      );
      const encodedResult = Web3Utils.getWeb3Instance(
        this.chainId
      ).eth.abi.encodeParameters(["address"], [address]);

      let jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
        this.chainId
      ).abi.filter((abi) => abi.name === "openLockTokenAndDraw")[0];

      let openPositionCall =
        Web3Utils.getWeb3Instance(this.chainId).eth.abi.encodeFunctionCall(jsonInterface, [
          SmartContractFactory.PositionManager(this.chainId).address,
          SmartContractFactory.StabilityFeeCollector(this.chainId).address,
          pool.CollateralTokenAdapterAddress,
          SmartContractFactory.StablecoinAdapter(this.chainId).address,
          pool.id,
          toWei(collateral.toString(), "ether"),
          toWei(fathomToken.toString(), "ether"),
          "1",
          encodedResult,
        ]);

      await wallet.methods
        .execute2(
          SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
            .address,
          openPositionCall
        )
        .send({ from: address })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.OpenPosition,
            active: false,
            status: TransactionStatus.None,
            title: `Opening Position Pending`,
            message: Strings.CheckOnBlockExplorer,
          });
        });
    } catch (error) {
      console.error(`Error in open position: ${error}`);
      throw error;
    }
  }

  //Create a proxy wallet for a user
  async createProxyWallet(address: string): Promise<string> {
    try {
      console.log("Creating a proxy wallet...");
      const proxyWalletRegistry = Web3Utils.getContractInstance(
        SmartContractFactory.ProxyWalletRegistry(this.chainId),
        this.chainId
      );

      await proxyWalletRegistry.methods.build(address).send({ from: address });
      return  await proxyWalletRegistry.methods
        .proxies(address)
        .call();
    } catch (error) {
      console.error(`Error in createProxyWallet: ${error}`);
      throw error;
    }
  }

  //Check if proxy wallet for a user
  async proxyWalletExist(address: string): Promise<string> {
    try {
      console.log(`Check if proxy wallet exist for address: ${address}`);
      const proxyWalletRegistry = Web3Utils.getContractInstance(
        SmartContractFactory.ProxyWalletRegistry(this.chainId),
        this.chainId
      );
      return await proxyWalletRegistry.methods
        .proxies(address)
        .call();
    } catch (error) {
      console.error(`Error in proxyWalletExist: ${error}`);
      throw error;
    }
  }

  async getPositionsForAddress(address: string): Promise<IOpenPosition[]> {
    try {
      console.log(`getting Positions For Address ${address}.`);
      let proxyWallet = await this.proxyWalletExist(address);
      let getPositionsContract = Web3Utils.getContractInstance(
        SmartContractFactory.GetPositions(this.chainId),
        this.chainId
      );
      let response = await getPositionsContract.methods
        .getAllPositionsAsc(
          SmartContractFactory.PositionManager(this.chainId).address,
          proxyWallet
        )
        .call();

      const {
        0: positionIds,
        1: positionAddresses,
        2: collateralPools,
      } = response;
      const fetchedPositions: IOpenPosition[] = [];
      let index = 0;

      positionIds.forEach((positionId: string) => {
        const positionAddress = positionAddresses[index];
        const collateralPool = collateralPools[index];
        const position = new OpenPosition(
          positionId,
          positionAddress,
          collateralPool
        );
        fetchedPositions.push(position);
        index++;
      });

      console.log(`All Open Positions... ${JSON.stringify(fetchedPositions)}`);
      return fetchedPositions;
    } catch (error) {
      console.error(`Error in getting Positions: ${error}`);
      throw error;
    }
  }

  //TODO: Externalize the pagination
  //TODO: Find better ways to filter out the posistions.
  async getPositionsWithSafetyBuffer(
    address: string
  ): Promise<IOpenPosition[]> {
    try {
      console.log(
        `getting Positions With Safety Buffer For Address ${address}.`
      );
      const myPositions = await this.getPositionsForAddress(address);
      const getPositionsContract = Web3Utils.getContractInstance(
        SmartContractFactory.GetPositions(this.chainId),
        this.chainId
      );
      const response = await getPositionsContract.methods
        .getPositionWithSafetyBuffer(
          SmartContractFactory.PositionManager(this.chainId).address,
          1,
          500
        )
        .call();

      console.log(
        `Raw response from getPositionsWithSafetyBuffer: ${JSON.stringify(
          response
        )}`
      );

      const {
        0: positionAddresses,
        1: debtShares,
        2: safetyBuffers,
        _lockedCollaterals: lockedCollaterals,
        _lockedValues: lockedValues,
        _positionLTVs: ltvs,
      } = response;

      const fetchedPositions: IOpenPosition[] = [];
      let index = 0;
      positionAddresses.forEach((positionAddress: string) => {
        const position = myPositions.filter(
          (pos) => pos.address === positionAddress
        )[0] as IOpenPosition;

        if (position && debtShares[index] > 0) {
          position.setDebtShare(new BigNumber(debtShares[index]));
          position.setSafetyBuffer(new BigNumber(safetyBuffers[index]));
          position.setLockedCollateral(new BigNumber(lockedCollaterals[index]));
          position.setLockedValue(new BigNumber(lockedValues[index]));
          position.setLtv(new BigNumber(ltvs[index]));
          fetchedPositions.push(position);
        }
        index++;
      });

      console.log(`All Open Positions... ${JSON.stringify(fetchedPositions)}`);
      return fetchedPositions;
    } catch (error) {
      console.error(`Error in getPositionsWithSafetyBuffer: ${error}`);
      throw error;
    }
  }

  async closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    lockedCollateral: BigNumber,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    try {
      console.log(`Closing position for position id ${positionId}.`);
      const proxyWalletAddress = await this.proxyWalletExist(address);

      const wallet = Web3Utils.getContractInstanceFrom(
        SmartContractFactory.proxyWallet.abi,
        proxyWalletAddress,
        this.chainId
      );

      const encodedResult =
        Web3Utils.getWeb3Instance(this.chainId).eth.abi.encodeParameters(
          ["address"],
          [address]
        );

      const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
        this.chainId
      ).abi.filter((abi) => abi.name === "wipeAllAndUnlockToken")[0];

      const wipeAllAndUnlockTokenCall =
        Web3Utils.getWeb3Instance(this.chainId).eth.abi.encodeFunctionCall(jsonInterface, [
          SmartContractFactory.PositionManager(this.chainId).address,
          pool.CollateralTokenAdapterAddress,
          SmartContractFactory.StablecoinAdapter(this.chainId).address,
          positionId,
          lockedCollateral.toString(),
          encodedResult,
        ]);

      await wallet.methods
        .execute2(
          SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
            .address,
          wipeAllAndUnlockTokenCall
        )
        .send({ from: address })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.ClosePosition,
            active: false,
            status: TransactionStatus.None,
            title: "Close Position Pending.",
            message: Strings.CheckOnBlockExplorer,
          });
        });
      console.log(`Position closed for position id ${positionId}.`);
    } catch (error) {
      console.error(`Error in closing position ${error}`);
      throw error;
    }
  }

  async partiallyClosePosition(
    position: IOpenPosition,
    pool: ICollateralPool,
    address: string,
    stablecoint: number,
    collateral: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    try {
      console.log(`Closing position for position id ${position.id}.`);
      const proxyWalletAddress = await this.proxyWalletExist(address);
      const wallet = Web3Utils.getContractInstanceFrom(
        SmartContractFactory.proxyWallet.abi,
        proxyWalletAddress,
        this.chainId
      );
      const encodedResult = Web3Utils.getWeb3Instance(
        this.chainId
      ).eth.abi.encodeParameters(["address"], [address]);

      const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
        this.chainId
      ).abi.filter((abi) => abi.name === "wipeAndUnlockToken")[0];

      const wipeAndUnlockTokenCall = Web3Utils.getWeb3Instance(
        this.chainId
      ).eth.abi.encodeFunctionCall(jsonInterface, [
        SmartContractFactory.PositionManager(this.chainId).address,
        pool.CollateralTokenAdapterAddress,
        SmartContractFactory.StablecoinAdapter(this.chainId).address,
        position.id,
        toWei(collateral.toString(), "ether"),
        toWei(stablecoint.toString(), "ether"),
        encodedResult,
      ]);

      await wallet.methods
        .execute2(
          SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
            .address,
          wipeAndUnlockTokenCall
        )
        .send({ from: address })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.ClosePosition,
            active: false,
            status: TransactionStatus.None,
            title: "Close Position Pending.",
            message: Strings.CheckOnBlockExplorer,
          });
        });

      console.log(`Collateral was returned.`);
    } catch (error) {
      console.error(`Error in closing position ${error}`);
      throw error;
    }
  }

  async approve(
    address: string,
    pool: ICollateralPool,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    try {
      let proxyWalletaddress = await this.proxyWalletExist(address);

      if (proxyWalletaddress === Constants.ZERO_ADDRESS) {
        proxyWalletaddress = await this.createProxyWallet(address);
      }

      const BEP20 = Web3Utils.getContractInstance(
        SmartContractFactory.BEP20(pool.collateralContractAddress),
        this.chainId
      );

      await BEP20.methods
        .approve(proxyWalletaddress, Constants.MAX_UINT256)
        .send({ from: address })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.Approve,
            active: false,
            status: TransactionStatus.None,
            title: `Approval Pending`,
            message: Strings.CheckOnBlockExplorer,
          });
        });
    } catch (error) {
      console.error(`Error in open position approve token: ${error}`);
      throw error;
    }
  }

  async approvalStatus(
    address: string,
    pool: ICollateralPool,
    collatral: number,
    transactionStore: ActiveWeb3Transactions
  ): Promise<Boolean> {
    try {
      // set collateral to zero if not defined
      if (!collatral) {
        collatral = 0;
      }

      const proxyWalletaddress = await this.proxyWalletExist(address);

      if (proxyWalletaddress === Constants.ZERO_ADDRESS) {
        return false;
      }

      const BEP20 = Web3Utils.getContractInstance(
        SmartContractFactory.BEP20(pool.collateralContractAddress),
        this.chainId
      );

      const allowance = await BEP20.methods
        .allowance(address, proxyWalletaddress)
        .call();

      return +allowance > +Constants.WeiPerWad.multipliedBy(collatral);
    } catch (error) {
      console.error(`Error in open position approve token: ${error}`);
      throw error;
    }
  }

  async approveStablecoin(
    address: string,
    transactionStore: ActiveWeb3Transactions
  ): Promise<void> {
    try {
      let proxyWalletAddress = await this.proxyWalletExist(address);

      if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
        proxyWalletAddress = await this.createProxyWallet(address);
      }

      const fathomStableCoin = Web3Utils.getContractInstance(
        SmartContractFactory.FathomStableCoin(this.chainId),
        this.chainId
      );

      await fathomStableCoin.methods
        .approve(proxyWalletAddress, Constants.MAX_UINT256)
        .send({ from: address })
        .on("transactionHash", (hash: any) => {
          transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.Approve,
            active: false,
            status: TransactionStatus.None,
            title: `Approval Pending`,
            message: Strings.CheckOnBlockExplorer,
          });
        });
    } catch (error) {
      console.error(`Error in open position approve token: ${error}`);
      throw error;
    }
  }

  async balanceStablecoin(address: string): Promise<number> {
    try {
      const fathomStableCoin = Web3Utils.getContractInstance(
        SmartContractFactory.FathomStableCoin(this.chainId),
        this.chainId
      );

      return fathomStableCoin.methods.balanceOf(address).call();
    } catch (error) {
      console.error(`Error in open position approve token: ${error}`);
      throw error;
    }
  }

  async approvalStatusStablecoin(address: string): Promise<Boolean> {
    try {
      const proxyWalletaddress = await this.proxyWalletExist(address);

      if (proxyWalletaddress === Constants.ZERO_ADDRESS) {
        return false;
      }

      const fathomStableCoin = Web3Utils.getContractInstance(
        SmartContractFactory.FathomStableCoin(this.chainId),
        this.chainId
      );

      const allowance = await fathomStableCoin.methods
        .allowance(address, proxyWalletaddress)
        .call();

      return +allowance > 10000000000000000;
    } catch (error) {
      console.error(`Error in open position approve token: ${error}`);
      throw error;
    }
  }

  setChainId(chainId: number) {
    if (chainId !== undefined) this.chainId = chainId;
  }
}
