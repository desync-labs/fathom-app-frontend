import { SmartContractFactory } from "config/SmartContractFactory";
import IPoolService from "services/interfaces/IPoolService";
import { Constants } from "helpers/Constants";
import { Web3Utils } from "helpers/Web3Utils";

export default class PoolService implements IPoolService {
  chainId = Constants.DEFAULT_CHAIN_ID;

  setChainId(chainId: number) {
    this.chainId = chainId;
  }

  async getUserTokenBalance(
    address: string,
    forAddress: string
  ): Promise<number> {
    const BEP20 = Web3Utils.getContractInstance(
      SmartContractFactory.BEP20(forAddress),
      this.chainId
    );

    return BEP20.methods.balanceOf(address).call();
  }

  async getDexPrice(forAddress: string): Promise<number> {
    const USDT = SmartContractFactory.USDT(this.chainId).address;

    const dexPriceOracle = Web3Utils.getContractInstance(
      SmartContractFactory.DexPriceOracle(this.chainId),
      this.chainId
    );

    const result = await dexPriceOracle.methods
      .getPrice(USDT, forAddress)
      .call();

    return result[0];
  }

  getCollateralTokenAddress(forAddress: string) {
    const abi = SmartContractFactory.CollateralTokenAdapterAbi();

    const collateralTokenAdapter = Web3Utils.getContractInstance(
      {
        address: forAddress,
        abi,
      },
      this.chainId
    );

    return collateralTokenAdapter.methods.collateralToken().call();
  }
}
