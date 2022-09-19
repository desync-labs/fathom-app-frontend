import IOpenPosition from "../../stores/interfaces/IOpenPosition";

export default interface IPositionService{
    openPosition(address:string,poolId:string,collatral:number,fathomToken:number): Promise<void>;
    createProxyWallet(address:string): Promise<string>;
    proxyWalletExist(address:string): Promise<string>;
    getPositionsForAddress(address:string): Promise<IOpenPosition[]>;
    getPositionsWithSafetyBuffer(address:string): Promise<IOpenPosition[]>;
    closePosition(positionId: string,address:string, debt:number): Promise<void>;
}