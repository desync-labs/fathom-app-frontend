import { FC, useCallback } from "react";
import { Box, Typography, styled, Button } from "@mui/material";
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
    height: 90%;
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
const ModalTitle = styled(Typography)`
  font-weight: 400;
  font-size: 2.125rem;
  line-height: 1.235;
`;

const SuccessMessage = styled(Typography)`
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
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

  const { addERC20Token, isMetamask } = useConnector();

  const { image } = erc20TokenModalData as ERC20TokenType;

  const addTokenToMetamaskWalletHandler = useCallback(() => {
    addERC20Token(erc20TokenModalData as ERC20TokenType);
  }, [addERC20Token]);

  return (
    <AppDialog
      onClose={resetErc20TokenModal}
      aria-labelledby="customized-dialog-title"
      open={true}
      color="primary"
      maxWidth="xsm"
    >
      <SuccessContentWrapper>
        <AppDialogTitle
          id="customized-dialog-title"
          onClose={resetErc20TokenModal}
        ></AppDialogTitle>
        <SuccessIconWrapper>
          <DoneIcon color="success" />
        </SuccessIconWrapper>
        <ModalTitle variant="h1">All done!</ModalTitle>
        <SuccessMessage>{successAlertMessage}</SuccessMessage>
        {isMetamask && (
          <DialogContentWrapper
            width={"80%"}
            sx={{
              alignItems: "center",
              textAlign: "center",
              margin: "30px 15px",
            }}
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
        )}
      </SuccessContentWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: {
            sm: "20px",
            xs: "0",
          },
        }}
        className="TxActionsWrapper"
      >
        <Button
          onClick={resetErc20TokenModal}
          variant="gradient"
          size="large"
          sx={{ minHeight: "44px" }}
          data-cy="closeButton"
        >
          Ok, Close
        </Button>
      </Box>
    </AppDialog>
  );
};

export default TransactionErc20TokenModal;
