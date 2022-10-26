import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { WrongNetwork } from "components/AppComponents/AppTypography/AppTypography";

export const Web3Status = () => {
  const { error, account } = useWeb3React();

  if (error) {
    return (
      <WrongNetwork
        color="error"
        label={
          error instanceof UnsupportedChainIdError
            ? "Wrong Network"
            : !account
            ? "Wallet Request Permissions Error"
            : "Error"
        }
      ></WrongNetwork>
    );
  }

  return null;
};
