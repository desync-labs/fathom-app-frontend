export default interface IPositionService{
    openPosition(address:string,poolId:string): Promise<void>;
    createProxyWallet(address:string): Promise<string>;
    proxyWalletExist(address:string): Promise<string>;
}