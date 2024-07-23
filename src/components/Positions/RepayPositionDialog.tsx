import { Dispatch, FC, memo } from "react";
import {
  Box,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { IOpenPosition } from "fathom-sdk";

import useRepayPositionContext from "context/repayPosition";
import { BaseDialogTitle } from "components/Base/Dialog/BaseDialogTitle";
import RepayPositionInfo from "components/Positions/RepayPosition/RepayPositionInfo";
import RepayPositionForm from "components/Positions/RepayPosition/RepayPositionForm";
import { BaseInfoBox, BaseWarningBox } from "components/Base/Boxes/StyledBoxes";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";

export type ClosePositionDialogPropsType = {
  topUpPosition: IOpenPosition | undefined;
  closePosition: IOpenPosition | undefined;
  setTopUpPosition: Dispatch<IOpenPosition | undefined>;
  setClosePosition: Dispatch<IOpenPosition | undefined>;
};

const RepayPositionDialog: FC<ClosePositionDialogPropsType> = ({
  topUpPosition,
  closePosition,
  setTopUpPosition,
  setClosePosition,
}) => {
  const {
    onClose,
    approveBtn,
    approve,
    approvalPending,
    balance,
    disableClosePosition,
    closePositionHandler,
    balanceError,
    balanceErrorNotFilled,
  } = useRepayPositionContext();

  return (
    <>
      <BaseDialogTitle id="customized-dialog-title" onClose={onClose}>
        Repay Position
      </BaseDialogTitle>
      <DialogContent>
        <Box>
          <RepayPositionForm
            topUpPosition={topUpPosition}
            closePosition={closePosition}
            setTopUpPosition={setTopUpPosition}
            setClosePosition={setClosePosition}
          />
          <RepayPositionInfo />

          {balanceError && (
            <BaseWarningBox>
              <InfoIcon
                sx={{ width: "16px", color: "#F5953D", height: "16px" }}
              />
              <Typography>
                Wallet balance is not enough to close this position entirely
                (repay in full).
              </Typography>
            </BaseWarningBox>
          )}
          {approveBtn && (
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
            disabled={approvalPending || disableClosePosition}
          >
            Close
          </ButtonSecondary>
          {approveBtn && balance !== "0" ? (
            <ButtonPrimary onClick={approve} disabled={approvalPending}>
              {" "}
              {approvalPending ? (
                <CircularProgress size={20} sx={{ color: "#0D1526" }} />
              ) : (
                "Approve token"
              )}{" "}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary
              onClick={closePositionHandler}
              disabled={
                balanceError ||
                balanceErrorNotFilled ||
                disableClosePosition ||
                approveBtn
              }
              isLoading={disableClosePosition}
            >
              {disableClosePosition ? (
                <CircularProgress sx={{ color: "#0D1526" }} size={20} />
              ) : (
                "Repay this position"
              )}
            </ButtonPrimary>
          )}
        </ModalButtonWrapper>
      </DialogContent>
    </>
  );
};

export default memo(RepayPositionDialog);
