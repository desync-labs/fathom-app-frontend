import { FC, memo } from "react";
import {
  Box,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";

import useOpenPositionContext from "context/openPosition";
import useConnector from "context/connector";

import { BaseDialogTitle } from "components/Base/Dialog/BaseDialogTitle";
import OpenPositionInfo from "components/Positions/OpenPosition/OpenPositionInfo";
import OpenPositionForm from "components/Positions/OpenPosition/OpenPositionForm";
import { BaseDialogWrapper } from "components/Base/Dialog/StyledDialog";
import WalletConnectBtn from "components/Common/WalletConnectBtn";
import { InfoIcon } from "components/Governance/Propose";
import { BaseInfoBox, BaseWarningBox } from "components/Base/Boxes/StyledBoxes";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";
import PositionFormAiAssist from "components/Positions/PositionFormAiAssist";

const OpenNewPositionDialog: FC = () => {
  const {
    pool,
    fathomToken,
    openPositionLoading,
    balance,
    approve,
    approvalPending,
    approveBtn,
    onClose,
    errors,
    proxyWalletExists,
    dangerSafetyBuffer,
    handleSubmit,
    onSubmit,
    setAiPredictionCollateral,
  } = useOpenPositionContext();

  const { isOpenPositionWhitelisted, account } = useConnector();

  return (
    <BaseDialogWrapper onClose={onClose} maxWidth="sm" open={true} fullWidth>
      <BaseDialogTitle id="customized-dialog-title" onClose={onClose}>
        Open Position
      </BaseDialogTitle>
      <DialogContent>
        <Box>
          <OpenPositionForm />
          {["XDC", "CGO"].includes(pool?.poolName?.toUpperCase()) && (
            <PositionFormAiAssist
              pool={pool}
              borrowInput={fathomToken}
              setAiPredictionCollateral={setAiPredictionCollateral}
            />
          )}
          <OpenPositionInfo />

          {!isOpenPositionWhitelisted && (
            <BaseWarningBox>
              <InfoIcon
                sx={{ width: "16px", color: "#F5953D", height: "16px" }}
              />
              <Typography>
                Your wallet address is not whitelisted for open position.
                <br />
                <a
                  href={
                    "https://docs.google.com/forms/d/e/1FAIpQLSdyQkwpYPAAUc5llJxk09ymMdjSSSjjiY3spwvRvCwfV08h2A/viewform"
                  }
                  target={"_blank"}
                  rel="noreferrer"
                >
                  Apply for being added to the whitelist to borrow FXD.
                </a>
              </Typography>
            </BaseWarningBox>
          )}
          {!proxyWalletExists && (
            <BaseWarningBox>
              <InfoIcon
                sx={{ width: "16px", color: "#F5953D", height: "16px" }}
              />
              <Typography>
                Your wallet address has no proxy wallet. <br />
                First transaction will be creation of proxy wallet.
              </Typography>
            </BaseWarningBox>
          )}
          {dangerSafetyBuffer ? (
            <BaseWarningBox>
              <InfoIcon
                sx={{ width: "16px", color: "#F5953D", height: "16px" }}
              />
              <Typography>
                Safety Buffer is moved into the danger zone. We recommend
                borrowing a lesser amount of FXD. Otherwise, your position may
                be at risk of liquidation if the price of collateral will drop.
              </Typography>
            </BaseWarningBox>
          ) : null}
          {approveBtn && !!balance && (
            <BaseInfoBox>
              <InfoIcon
                sx={{ width: "16px", color: "#F5953D", height: "16px" }}
              />
              <Box flexDirection="column">
                <Typography width="100%">
                  First-time connect? Please allow token approval in your
                  MetaMask
                </Typography>
              </Box>
            </BaseInfoBox>
          )}
        </Box>
        <ModalButtonWrapper>
          <ButtonSecondary
            onClick={onClose}
            disabled={approvalPending || openPositionLoading}
          >
            Close
          </ButtonSecondary>
          {!account ? (
            <WalletConnectBtn />
          ) : approveBtn && balance !== "0" ? (
            <ButtonPrimary
              onClick={approve}
              disabled={!!Object.keys(errors).length || approvalPending}
            >
              {" "}
              {approvalPending ? (
                <CircularProgress size={20} sx={{ color: "#0D1526" }} />
              ) : (
                "Approve token"
              )}{" "}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={
                openPositionLoading ||
                approveBtn ||
                !!Object.keys(errors).length ||
                !isOpenPositionWhitelisted
              }
              isLoading={openPositionLoading}
            >
              {openPositionLoading ? (
                <CircularProgress sx={{ color: "#0D1526" }} size={20} />
              ) : (
                "Open this position"
              )}
            </ButtonPrimary>
          )}
        </ModalButtonWrapper>
      </DialogContent>
    </BaseDialogWrapper>
  );
};

export default memo(OpenNewPositionDialog);
