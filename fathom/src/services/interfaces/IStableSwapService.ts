export default interface IStableSwapService{
    swapTokenToStablecoin(address:string, tokenIn:number): Promise<void>;
    swapStablecoinToToken(address:string, stablecoinIn:number): Promise<void>;
}