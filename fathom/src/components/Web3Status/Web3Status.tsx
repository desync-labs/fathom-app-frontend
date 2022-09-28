import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { Chip } from "@mui/material";

export const Web3Status = () => {
  const { error, account } = useWeb3React();

  if (error) {
    return (
      <Chip
        color="error"
        label={
          error instanceof UnsupportedChainIdError
            ? "Wrong Network"
            : !account
            ? "Wallet Request Permissions Error"
            : "Error"
        }
      ></Chip>
    );
  }

  return null;
};
