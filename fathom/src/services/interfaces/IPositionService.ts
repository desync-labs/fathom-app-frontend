import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import IOpenPosition from "../../stores/interfaces/IOpenPosition";

export default interface IPositionService{
    openPosition(address:string,pool:ICollatralPool,collatral:number,fathomToken:number): Promise<void>;
    createProxyWallet(address:string): Promise<string>;
    proxyWalletExist(address:string): Promise<string>;
    getPositionsForAddress(address:string): Promise<IOpenPosition[]>;
    getPositionsWithSafetyBuffer(address:string): Promise<IOpenPosition[]>;
    closePosition(positionId: string,pool:ICollatralPool,address:string, debt:number): Promise<void>;
}