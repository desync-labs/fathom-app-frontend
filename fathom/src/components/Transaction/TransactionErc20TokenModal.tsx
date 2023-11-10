import { FC } from "react";
import { Box, Typography, styled } from "@mui/material";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import {
  AppDialog,
  DialogContentWrapper,
} from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import useAlertAndTransactionContext from "context/alertAndTransaction";
import useConnector, { ERC20TokenType } from "context/connector";

import DoneIcon from "@mui/icons-material/Done";
import WalletIcon from "@mui/icons-material/Wallet";

export const SuccessContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SuccessIconWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2a3e5a;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const TransactionErc20TokenModal: FC = () => {
  const { erc20TokenModalData, successAlertMessage, resetErc20TokenModal } =
    useAlertAndTransactionContext();

  const { addERC20Token } = useConnector();

  const { address, symbol, decimals, image } =
    erc20TokenModalData as ERC20TokenType;

  const addTokenToMetamaskWalletHandler = () => {
    addERC20Token({ address, symbol, decimals, image });
    resetErc20TokenModal();
  };

  return (
    <AppDialog
      onClose={resetErc20TokenModal}
      aria-labelledby="customized-dialog-title"
      maxWidth="sm"
      open={true}
      color="primary"
    >
      <SuccessContentWrapper>
        <AppDialogTitle
          id="customized-dialog-title"
          onClose={resetErc20TokenModal}
        ></AppDialogTitle>
        <SuccessIconWrapper>
          <DoneIcon color="success" />
        </SuccessIconWrapper>
        <Typography variant="h4">All done!</Typography>
        <Typography component="span" variant="subtitle1">
          {successAlertMessage}
        </Typography>
        <DialogContentWrapper width={"80%"}>
          {image && <img src={image} alt={"fxd"} width={28} height={28} />}
          <Typography component="span" variant="body2">
            Add FXD to wallet to track your balance.
          </Typography>
          <ButtonPrimary onClick={addTokenToMetamaskWalletHandler}>
            <WalletIcon sx={{ fontSize: "16px", marginRight: "7px" }} />
            Add to wallet
          </ButtonPrimary>
        </DialogContentWrapper>
      </SuccessContentWrapper>
    </AppDialog>
  );
};

export default TransactionErc20TokenModal;
