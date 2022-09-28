import ILockPosition from "../../stores/interfaces/ILockPosition";

export default interface IStakingService{
    createLock(
        address:string,
        stakePosition:number, 
        unlockPeriod: number,
        chainId: number
      ): Promise<void> ;

      getLockPositions(
        account:string,chainId: number): Promise<ILockPosition[]>;
      
      handleUnlock(
        account: string, 
        lockId: number,
        chainId: number): Promise<void>;

      handleEarlyWithdrawal(
          account: string, 
          lockId: number,
          chainId: number
      ): Promise<void>;


      handleClaimRewards(account: string,streamId: number,chainId: number): Promise<void>;
      handleWithdrawRewards(account: string,streamId: number,chainId: number): Promise<void>;
      getAPR(chainId: number):Promise<number>;
}