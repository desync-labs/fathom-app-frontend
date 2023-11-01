import { SmartContractFactory } from "config/SmartContractFactory";
import IPoolService from "services/interfaces/IPoolService";
import {
  DEFAULT_CHAIN_ID
} from "helpers/Constants";
import { Web3Utils } from "helpers/Web3Utils";
import Xdc3 from "xdc3";
import {
  UseAlertAndTransactionServiceType
} from "context/alertAndTransaction";

export default class PoolService implements IPoolService {
  chainId = DEFAULT_CHAIN_ID;
  alertAndTransactionContext: UseAlertAndTransactionServiceType;
  constructor(alertAndTransactionContext: UseAlertAndTransactionServiceType) {
    this.alertAndTransactionContext = alertAndTransactionContext;
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }

  async getUserTokenBalance(
    address: string,
    forAddress: string,
    library: Xdc3
  ) {
    const BEP20 = Web3Utils.getContractInstance(
      SmartContractFactory.BEP20(forAddress),
      library
    );

    return BEP20.methods.balanceOf(address).call();
  }

  async getTokenDecimals(
    forAddress: string,
    library: Xdc3
  ) {
    const BEP20 = Web3Utils.getContractInstance(
      SmartContractFactory.BEP20(forAddress),
      library
    );

    return BEP20.methods.decimals().call();
  }

  async getDexPrice(forAddress: string, library: Xdc3) {
    const USStable = SmartContractFactory.USDT(this.chainId).address;

    const dexPriceOracle = Web3Utils.getContractInstance(
      SmartContractFactory.DexPriceOracle(this.chainId),
      library
    );

    const result = await dexPriceOracle.methods
      .getPrice(USStable, forAddress)
      .call();

    return result[0];
  }

  getCollateralTokenAddress(forAddress: string, library: Xdc3) {
    try {
      const abi = SmartContractFactory.CollateralTokenAdapterAbi();

      const collateralTokenAdapter = Web3Utils.getContractInstance(
        {
          address: forAddress,
          abi,
        },
        library
      );

      return collateralTokenAdapter.methods.collateralToken().call();
    } catch (e: any) {
      this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
    }
  }
}
