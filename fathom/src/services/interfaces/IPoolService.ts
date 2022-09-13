import ICollatralPool from "../../stores/interfaces/ICollatralPool";

export default interface IPoolService{
    fetchPools(): Promise<ICollatralPool>;
}