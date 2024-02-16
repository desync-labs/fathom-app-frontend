import { FC, useCallback } from "react";
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
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    height: 100%;
  }
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

const SuccessMessage = styled(Typography)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-bottom: 25px;
  }
`;

const TransactionErc20TokenModal: FC = () => {
  const {
    erc20TokenModalData,
    successAlertMessage,
    erc20TokenModalDescription,
    resetErc20TokenModal,
  } = useAlertAndTransactionContext();

  const { addERC20Token } = useConnector();

  const { image } = erc20TokenModalData as ERC20TokenType;

  const addTokenToMetamaskWalletHandler = useCallback(() => {
    addERC20Token(erc20TokenModalData as ERC20TokenType);
    resetErc20TokenModal();
  }, [addERC20Token, resetErc20TokenModal]);

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
        <SuccessMessage>{successAlertMessage}</SuccessMessage>
        <DialogContentWrapper
          width={"80%"}
          sx={{ alignItems: "center", margin: "30px 15px" }}
        >
          {image && <img src={image} alt={"fxd"} width={28} height={28} />}
          <Typography variant={"body2"} component="span">
            {erc20TokenModalDescription}
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
