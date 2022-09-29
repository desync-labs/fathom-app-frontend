import ITimeObject from './ITimeObject'
export default interface ILockPosition{

    lockId:number
    VOTETokenBalance:number
    MAINTokenBalance:number
    EndTime:number
    RewardsAvailable: string
    timeObject: ITimeObject
}