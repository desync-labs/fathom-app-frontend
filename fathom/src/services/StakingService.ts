import { SmartContractFactory } from "../config/SmartContractFactory";
import IStakingService from "./interfaces/IStakingService";
import { Web3Utils } from "../helpers/Web3Utils";

import ActiveWeb3Transactions from "../stores/transaction.store";
import {
  TransactionStatus,
  TransactionType,
} from "../stores/interfaces/ITransaction";
import { Constants } from "../helpers/Constants";
import ILockPosition from "../stores/interfaces/ILockPosition";



export default class StakingService implements IStakingService {
  chainId = 51;
  async createLock(
    address:string,
    stakePosition:number, 
    unlockPeriod: number,
    chainId: number
  ): Promise<void> {
    chainId = chainId || this.chainId;
    try {
    if(chainId){

      const MainToken = Web3Utils.getContractInstance(
        SmartContractFactory.MainToken(chainId),
        chainId
      )
      console.log("HERE1")
      console.log("SmartContractFactory.Staking(this.chainId).address:  ")
      console.log(SmartContractFactory.Staking(chainId).address)

      console.log("Constants.WeiPerWad.multipliedBy(stakePosition).toString()")
      console.log(Constants.WeiPerWad.multipliedBy(stakePosition).toString())
      
      await MainToken.methods.approve(
        '0xA82a7351ccd2949566305850A0877BA86E0e6a33',
        //SmartContractFactory.Staking(this.chainId).address,
        Constants.WeiPerWad.multipliedBy(stakePosition).toString()
      ).send({from:address})

      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
      )
      const day = 24 * 60 * 60;
      console.log("timestamp  HERE: ", (await this.getTimestamp(chainId)).toString())
      let lockingPeriod = unlockPeriod * day;
      let endTime =await this.getTimestamp(chainId);
      if(endTime){
        endTime = endTime + lockingPeriod;
      }

      if (lockingPeriod > 0) {
               endTime = await this.getTimestamp(chainId) + lockingPeriod;
             }

      await Staking.methods.createLock(
        Constants.WeiPerWad.multipliedBy(stakePosition).toString(),
        endTime
      ).send({from:address})
    }
    } catch (err) {
        console.log(err);
    }


  }


  async getLockPositions(
    account:string,
    chainId: number): Promise<ILockPosition[]>{
    chainId = chainId || this.chainId;
    let lockPosition = {} as ILockPosition;
    let lockPositionsList = [] as ILockPosition[]
    chainId = chainId || this.chainId;
    try{
      if(chainId){
        
        const Staking = Web3Utils.getContractInstance(
            SmartContractFactory.Staking(chainId),chainId
          )

        const StakingGetter = Web3Utils.getContractInstance(
            SmartContractFactory.StakingGetter(chainId),chainId
        )

        const result =await StakingGetter.methods.getLocksLength(
            account
        ).call()
        
      
        for (let i = 0; i < result; i++){
          console.log("lockPosition....2:",result)
          
          const { 0: amountOfMAINTkn, 
            1: amountOfveMAINTkn, 
            4: end
             } =
          await StakingGetter.methods.getLock(
                account,
                i+1
            ).call()
            
            const amountOfRewardsAvailable =  
              await Staking.methods.getStreamClaimableAmountPerLock(1, account, i+1).call()

            lockPosition.lockId = i+1;
            lockPosition.MAINTokenBalance = await this._convertToEtherBalance(amountOfMAINTkn,chainId);
            lockPosition.VOTETokenBalance = await this._convertToEtherBalance(amountOfveMAINTkn,chainId);
            lockPosition.EndTime = end;
            lockPosition.RewardsAvailable = await this._convertToEtherBalance(amountOfRewardsAvailable,chainId);
            
            
            console.log(lockPosition)
            lockPositionsList.push(lockPosition)
          }
            return lockPositionsList;   
      }else 
        return [];
    }catch(error){
        console.error(`Error in fetching Locks: ${error}`);
        return [];
    }
  }



  async handleUnlock(
      account: string, 
      lockId: number,
      chainId: number): Promise<void> {
      chainId = chainId || this.chainId;
      try{
      const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(chainId),
          chainId
        )
        await Staking.methods.unlock(
          lockId
        ).send({from:account})
      }catch(error){
        console.error(`Error in Unlock: ${error}`);
      }
      }
      

  async handleEarlyWithdrawal(
      account: string, 
      lockId: number,
      chainId: number
  ): Promise<void>{
    chainId = chainId || this.chainId;
    console.log('is account here',account)
    try{
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
      )
      console.log('is account here',account)
      console.log('getting LockID:',lockId)
      await Staking.methods.earlyUnlock(
        lockId
      ).send({from:account})
    }catch(error) {
      console.error(`Error in Early Withdrawal: ${error}`);
    }
  }

  async handleClaimRewards(
    account:string,
    streamId: number,
    chainId: number): Promise<void> {
    chainId = chainId || this.chainId;
    try{
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
      )
      Staking.methods.claimAllLockRewardsForStream(streamId).send({from: account})
    }catch(error){
      console.error(`Error in Claim Rewards: ${error}`);
    }
  }

  async handleWithdrawRewards(
    account: string,
    streamId: number,
    chainId: number): Promise<void> {
    chainId = chainId || this.chainId;
    try{
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
      )
      Staking.methods.withdrawAll(streamId).send({from: account})
    }catch(error){
      console.error(`Error in Withdraw rewards: ${error}`);
    }
  }



  async getOneDayRewardForStream1():Promise<number> 
  {
    const oneDay = 86400
    const oneYear = 365 * 24 * 60 * 60
  
    const oneDayReward = 20000 * oneDay / oneYear;
    return oneDayReward
  }
  
  async getAPR(chainId: number): Promise<number> {
    chainId = chainId || this.chainId;
    try{
      const oneDayReward = await this.getOneDayRewardForStream1()
      const oneYearStreamRewardValue = oneDayReward * 365;

      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(chainId),
        chainId
      )
      

      let totalStaked = await Staking.methods.totalAmountOfStakedMAINTkn().call();
      totalStaked = await this.fromWei(totalStaked,chainId)
      let totalAPR = oneYearStreamRewardValue * 100 / totalStaked;
      const APR = parseInt(totalAPR.toString())
      return APR;
    }catch(error){
      console.error(`Error in get APR: ${error}`);
      return 0;
    }
  }

  async getWalletBalance(account: string,chainId:number):Promise<number> {
    chainId = chainId || this.chainId
    try{
    const MainToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(chainId),
      chainId
    )

    let balance = MainToken.methods.balanceOf(
      account
    ).call()

    return balance
    }catch(error){
      console.error(`Error in get wallet balance: ${error}`);
      return 0;
    }
  }

  async getTimestamp(chainId: number): Promise<number> {
    chainId = chainId || this.chainId;
    console.log(`getTimestamp`);
    const web3 = Web3Utils.getWeb3Instance(chainId)
    var blockNumber = await web3.eth.getBlockNumber();
    var block = await web3.eth.getBlock(blockNumber);
    var timestamp = block.timestamp
    return timestamp;
  }

  async fromWei(balance: number, chainId: number): Promise<number>{
    chainId = chainId || this.chainId;
    const web3 = Web3Utils.getWeb3Instance(chainId)
    return web3.utils.fromWei(balance.toString(), "ether");
  }
  
  async _convertToEtherBalance(balance: number, chainId: number): Promise<number>{
    chainId = chainId || this.chainId;
    return parseInt((await this.fromWei(balance,chainId)).toString())
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}



