import BigNumber from "bignumber.js"

export default interface IOpenPosition{
    id:string
    address:string
    pool:string
    debtShare:BigNumber
    safetyBuffer:BigNumber
    lockedCollateral:BigNumber
    lockedValue:BigNumber
    ltv:BigNumber
}


export default class OpenPosition implements IOpenPosition{
   constructor(_id:string, _address:string, _pool:string){
        this.id = _id;
        this.address = _address;
        this.pool = _pool;
        this.debtShare = new BigNumber(0);
        this.safetyBuffer = new BigNumber(0);
        this.lockedCollateral = new BigNumber(0);
        this.lockedValue = new BigNumber(0);
        this.ltv = new BigNumber(0);
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

   setLockedCollateral(_lockedCollateral:BigNumber){
     this.lockedCollateral = _lockedCollateral;
   }

   setLockedValue(_lockedValue:BigNumber){
     this.lockedValue = _lockedValue;
   }

   setLtv(_ltv:BigNumber){
     this.ltv = _ltv;
   }
}
