import BigNumber from "bignumber.js";
import { SmartContractFactory } from "../config/SmartContractFactory";
import { Constants } from "../helpers/Constants";
import { Web3Utils } from "../helpers/Web3Utils";
import IFXDProtocolStats from "../stores/interfaces/IFXDProtocolStats";
import IFXDProtocolStatsService from "./interfaces/IFXDProtocolStatsService";

//TODO: Should create a BaseService Class to handle basic setup like chain-id
export default class FXDProtocolStatsService
  implements IFXDProtocolStatsService
{
  chainId = Constants.DEFAULT_CHAINID;

  async fetchProtocolStats(): Promise<IFXDProtocolStats> {
    try {
      console.log(`Fetching Protocol Stats.`);
      let protocolStatContract = Web3Utils.getContractInstance(
        SmartContractFactory.FathomStats(this.chainId),
        this.chainId
      );
      let response = await protocolStatContract.methods.getFathomInfo().call();

      const {
        0: fathomSupplyCap,
        1: totalValueLocked,
        2: fxdPriceFromDex,
        3: liquidationRatio,
        4: closeFactor,
      } = response;

      const stats: IFXDProtocolStats = {
        fathomSupplyCap: new BigNumber(fathomSupplyCap),
        totalValueLocked: new BigNumber(totalValueLocked),
        fxdPriceFromDex: new BigNumber(fxdPriceFromDex),
        liquidationRatio: new BigNumber(liquidationRatio),
        closeFactor: new BigNumber(closeFactor),
      };

      console.log(`Fetched protocol stats are ${JSON.stringify(stats)}`);
      return stats;
    } catch (error) {
      console.error(`Error in Fetching Protocol Stats.: ${error}`);
      throw error;
    }
  }

  //TODO: Should move this code to BaseService.
  setChainId(chainId: number) {
    if (chainId !== undefined) this.chainId = chainId;
  }
}
