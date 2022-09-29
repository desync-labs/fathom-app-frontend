import ICollatralPool from "../../stores/interfaces/ICollatralPool";

export default interface IPoolService{
    fetchPools(): Promise<ICollatralPool[]>;
    getPriceWithSafetyMargin(pool:ICollatralPool): Promise<number>;
    getUserTokenBalance(address:string, pool:ICollatralPool): Promise<number>;
}