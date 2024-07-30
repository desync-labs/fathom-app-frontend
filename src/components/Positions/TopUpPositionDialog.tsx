import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";

import useTopUpPositionContext from "context/topUpPosition";
import useConnector from "context/connector";
import { DANGER_SAFETY_BUFFER } from "utils/Constants";

import { BaseDialogTitle } from "components/Base/Dialog/BaseDialogTitle";
import { ClosePositionDialogPropsType } from "components/Positions/RepayPositionDialog";
import TopUpPositionInfo from "components/Positions/TopUpPosition/TopUpPositionInfo";
import TopUpPositionForm from "components/Positions/TopUpPosition/TopUpPositionForm";
import PositionFormAiAssist from "components/Positions/PositionFormAiAssist";
import WalletConnectBtn from "components/Common/WalletConnectBtn";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";
import {
  BaseErrorBox,
  BaseInfoBox,
  BaseWarningBox,
} from "components/Base/Boxes/StyledBoxes";

const TopUpPositionDialog: FC<ClosePositionDialogPropsType> = ({
  topUpPosition,
  closePosition,
  setTopUpPosition,
  setClosePosition,
}) => {
  const {
    pool,
    position,
    totalFathomToken,
    collateral,
    safetyBuffer,
    onClose,
    approvalPending,
    openPositionLoading,
    approve,
    approveBtn,
    errorAtLeastOneField,
    balance,
    handleSubmit,
    onSubmit,
    setAiPredictionCollateral,
  } = useTopUpPositionContext();
  const { account } = useConnector();

  return (
    <>
      <BaseDialogTitle id="customized-dialog-title" onClose={onClose}>
        Top Up Position
      </BaseDialogTitle>
      <DialogContent>
        <Box>
          <TopUpPositionForm
            topUpPosition={topUpPosition}
            closePosition={closePosition}
            setTopUpPosition={setTopUpPosition}
            setClosePosition={setClosePosition}
          />
          {["XDC", "CGO"].includes(pool?.poolName?.toUpperCase()) && (
            <PositionFormAiAssist
              pool={pool}
              borrowInput={totalFathomToken}
              setAiPredictionCollateral={setAiPredictionCollateral}
              lockedCollateral={position?.lockedCollateral}
            />
          )}
          <TopUpPositionInfo />

          {BigNumber(safetyBuffer).isLessThan(DANGER_SAFETY_BUFFER) && (
            <BaseWarningBox>
              <InfoIcon
                sx={{ width: "16px", color: "#F5953D", height: "16px" }}
              />
              <Typography>
                Resulting in lowering safety buffer - consider provide more
                collateral or borrow less FXD.
              </Typography>
            </BaseWarningBox>
          )}
          {BigNumber(collateral).isLessThanOrEqualTo(0) && (
            <BaseWarningBox>
              <InfoIcon
                sx={{ width: "16px", color: "#F5953D", height: "16px" }}
              />
              <Typography>
                Providing 0 collateral you are making your position unsafer.
              </Typography>
            </BaseWarningBox>
          )}
          {errorAtLeastOneField && (
            <BaseErrorBox>
              <InfoIcon
                sx={{ width: "16px", color: "#F5953D", height: "16px" }}
              />
              <Typography>Please fill at least one field</Typography>
            </BaseErrorBox>
          )}
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
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={
                approveBtn || openPositionLoading || errorAtLeastOneField
              }
              isLoading={openPositionLoading}
            >
              {openPositionLoading ? (
                <CircularProgress sx={{ color: "#0D1526" }} size={20} />
              ) : (
                "Top Up this position"
              )}
            </ButtonPrimary>
          )}
        </ModalButtonWrapper>
      </DialogContent>
    </>
  );
};

export default memo(TopUpPositionDialog);
