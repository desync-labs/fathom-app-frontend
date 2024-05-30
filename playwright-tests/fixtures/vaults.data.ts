import dotenv from "dotenv";
dotenv.config();

export const fxdVaultData = {
  name: "Fathom USD",
  id:
    process.env.CHAIN === "sepolia"
      ? "0x775a2c63c79062a9ecb265b62cf155a7934e0b6e"
      : "0xfed8e57d02af00cabbb9418f9c5e1928b4d14f01",
  shareTokenName: "FXD-fVault-1",
};
