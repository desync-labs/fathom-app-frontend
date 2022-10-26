import BigNumber from "bignumber.js";

export default interface IFXDProtocolStats {
  fathomSupplyCap: BigNumber;
  totalValueLocked: BigNumber;
  fxdPriceFromDex: BigNumber;
  liquidationRatio: BigNumber;
  closeFactor: BigNumber;
}
