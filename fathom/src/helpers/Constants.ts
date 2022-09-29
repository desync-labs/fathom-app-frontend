import BigNumber from "bignumber.js";

export class Constants {
  public static WeiPerWad = new BigNumber("1e18");
  public static WeiPerRay = new BigNumber("1e27");
  public static WeiPerRad = new BigNumber("1e45");
  public static ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  public static TransactionCheckUpdateInterval = 2000;

  public static DEFAULT_CHAINID = 51 //Apothem network
  public static MAX_UINT256  = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
  //new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

  public static Status = [
    "Pending",
    "Active",
    "Canceled",
    "Defeated",
    "Succeeded",
    "Queued",
    "Expired",
    "Executed",
  ];
}