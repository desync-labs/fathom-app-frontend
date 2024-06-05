export const contractAddresses = {
  fathomStableCoin: "0xDf29cB40Cb92a1b8E8337F542E3846E185DefF96",
  fathomStablecoinVaults:
    process.env.CHAIN_ID === "apothem"
      ? "0xDf29cB40Cb92a1b8E8337F542E3846E185DefF96"
      : process.env.CHAIN_ID === "sepolia"
      ? "0x39c61c91eb75aae76e18f06566d3329076a58b81"
      : "0xDf29cB40Cb92a1b8E8337F542E3846E185DefF96",
  testXdcToken: "0xcefC4215f4F92a80ab5F2b2A8E94078A3E79b26E",
};

export const logoLinks = {
  daoFTHMLogo:
    "https://raw.githubusercontent.com/Into-the-Fathom/assets/master/blockchains/xinfin/0x3279dBEfABF3C6ac29d7ff24A6c46645f3F4403c/logo.png",
};
