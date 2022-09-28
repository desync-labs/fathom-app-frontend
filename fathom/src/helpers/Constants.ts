import BigNumber from "bignumber.js";

export class Constants{
    public static WeiPerWad = new BigNumber('1e18')
    public static WeiPerRad = new BigNumber('1e45')
    public static ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';  
    public static TransactionCheckUpdateInterval = 2000;
    public static MAX_UINT256  = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
}