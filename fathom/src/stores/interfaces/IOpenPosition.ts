import BigNumber from "bignumber.js"

export default interface IOpenPosition{
    id:string
    address:string
    pool:string
    debtShare:BigNumber
    safetyBuffer:BigNumber
}


export default class OpenPosition implements IOpenPosition{
   constructor(_id:string, _address:string, _pool:string){
        this.id = _id;
        this.address = _address;
        this.pool = _pool;
        this.debtShare = new BigNumber(0);
        this.safetyBuffer = new BigNumber(0);
   }

   setDebtShare(_debtShare:BigNumber){
        this.debtShare = _debtShare;
   }

   setSafetyBuffer(_safetyBuffer:BigNumber){
        this.safetyBuffer = _safetyBuffer;
   }

   isSafe(): boolean{
    return this.safetyBuffer.gt(0) ? true : false
   }


}
