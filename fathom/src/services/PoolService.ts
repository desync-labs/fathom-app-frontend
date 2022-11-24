import { SmartContractFactory } from "config/SmartContractFactory";
import IPoolService from "services/interfaces/IPoolService";
import { Constants } from "helpers/Constants";
import { Web3Utils } from "helpers/Web3Utils";

export default class PoolService implements IPoolService {
  chainId = Constants.DEFAULT_CHAIN_ID;

  setChainId(chainId: number) {
    if (chainId !== undefined) this.chainId = chainId;
  }

  async getUserTokenBalance(
    address: string,
    forAddress: string,
  ): Promise<number> {
    try {
      const BEP20 = Web3Utils.getContractInstance(
        SmartContractFactory.BEP20(forAddress),
        this.chainId
      );

      return BEP20.methods.balanceOf(address).call();
    } catch (exception) {
      console.log(
        `Error fetching pool information: ${JSON.stringify(exception)}`
      );
      throw exception;
    }
  }

  async getDexPrice(forAddress: string): Promise<number> {
    console.log("in get dex price");
    try {
      const USDT = SmartContractFactory.USDT(this.chainId).address;

      const dexPriceOracle = Web3Utils.getContractInstance(
        SmartContractFactory.DexPriceOracle(this.chainId),
        this.chainId
      );

      const result = await dexPriceOracle.methods
        .getPrice(USDT, forAddress)
        .call();

      const price = result[0];

      return price;
    } catch (error) {
      console.error(`Error in open position approve token : ${error}`);
      throw error;
    }
  }
}
