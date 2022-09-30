import { SmartContractFactory } from "../config/SmartContractFactory";
import ICollatralPool from "../stores/interfaces/ICollatralPool";
import IPoolService from "./interfaces/IPoolService";
import BigNumber from "bignumber.js";
import { Constants } from "../helpers/Constants";
import { Web3Utils } from "../helpers/Web3Utils";

export default class PoolService implements IPoolService {
  chainId = Constants.DEFAULT_CHAINID;
  //Ideally this should be dynamic
  getPools(): ICollatralPool[] {
    const pools: ICollatralPool[] = [];
    //0x5758444300000000000000000000000000000000000000000000000000000000
    pools.push(
      {
        id: "0x5758444300000000000000000000000000000000000000000000000000000000",
        name: "WXDC",
        collateralContractAddress: SmartContractFactory.WXDC(this.chainId)
          .address,
        CollateralTokenAdapterAddress:
          SmartContractFactory.WXDCCollateralTokenAdapter(this.chainId).address,
        availableFathom: "",
        borrowedFathom: "",
      },
      {
        id: "0x555344542d535441424c45000000000000000000000000000000000000000000",
        name: "USDT",
        collateralContractAddress: SmartContractFactory.USDT(this.chainId)
          .address,
        CollateralTokenAdapterAddress:
          SmartContractFactory.USDTCollateralTokenAdapter(this.chainId).address,
        availableFathom: "",
        borrowedFathom: "",
      }
    );

    return pools;
  }

  async fetchPools(): Promise<ICollatralPool[]> {
    console.log("fetching Pools...");
    let pools: ICollatralPool[] = [];
    try {
      let contract = Web3Utils.getContractInstance(
        SmartContractFactory.PoolConfig(this.chainId)
      );
      for (const pool of this.getPools()) {
        let response = await contract.methods
          .getCollateralPoolInfo(pool.id)
          .call();
        let debtShare = new BigNumber(response[1]).div(Constants.WeiPerWad);
        let debtCeiling = new BigNumber(response[2]).div(Constants.WeiPerRad);
        pool.availableFathom = debtCeiling.minus(debtShare).toFormat(0);
        pool.borrowedFathom = debtShare.toFormat(0);
        pools.push(pool);
      }

      console.log(`Pool details ${JSON.stringify(pools)} `);
      return pools;
    } catch (exception) {
      console.log(
        `Error fetching pool information: ${JSON.stringify(exception)}`
      );
    } finally {
      return pools;
    }
  }

  setChainId(chainId: number) {
    if(chainId !== undefined)
      this.chainId = chainId;
  }

  async getPriceWithSafetyMargin(pool: ICollatralPool): Promise<number> {
    try {
      let contract = Web3Utils.getContractInstance(
        SmartContractFactory.PoolConfig(this.chainId)
      );
      let response = await contract.methods
        .getPriceWithSafetyMargin(pool.id)
        .call();

      return new BigNumber(response).div(Constants.WeiPerRay).toNumber();
    } catch (exception) {
      console.log(
        `Error fetching pool information: ${JSON.stringify(exception)}`
      );
      throw exception;
    }
  }

  async getUserTokenBalance(address:string, pool: ICollatralPool): Promise<number> {
    try{

        const BEP20 = Web3Utils.getContractInstance(SmartContractFactory.BEP20(pool.collateralContractAddress),this.chainId)

        let balance = await BEP20.methods.balanceOf(address).call();
      
        return balance;
        
    }catch(exception){
        console.log(`Error fetching pool information: ${JSON.stringify(exception)}`)
        throw exception;
    }
}

async getDexPrice(): Promise<number>{
  console.log("in get dex price")
  try{
   
      let USDT = SmartContractFactory.USDT(this.chainId).address;
      let WXDC = SmartContractFactory.WXDC(this.chainId).address;

      const dexPriceOracle = Web3Utils.getContractInstance(SmartContractFactory.DexPriceOracle(this.chainId),this.chainId)

      let result = await dexPriceOracle.methods.getPrice(USDT, WXDC).call()
      let price = result[0];
      
      return price
  }catch(error){
      console.error(`Error in open position approve token : ${error}`)
      throw error;
  }
}
}
