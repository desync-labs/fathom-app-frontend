import BigNumber from "bignumber.js";

export class Constants {
  public static WeiPerWad = new BigNumber("1e18");
  public static WeiPerRad = new BigNumber("1e45");
  public static ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  public static TransactionCheckUpdateInterval = 2000;

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

  // public static Status = {
  //     0: "Pending",
  //     1: "Active",
  //     2: "Canceled",
  //     3: "Defeated",
  //     4: "Succeeded",
  //     5: "Queued",
  //     6: "Expired",
  //     7: "Executed"
  // }
}
