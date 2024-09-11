import { FC, memo } from "react";
import {
  Box,
  CircularProgress,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { ILockPosition } from "fathom-sdk";

import useEarlyUnstake from "hooks/Staking/useEarlyUnstake";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";
import useSharedContext from "context/shared";

import { ButtonsWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";
import { BaseDialogTitle } from "components/Base/Dialog/BaseDialogTitle";
import {
  BaseInfoBox,
  BaseWarningBox,
  InfoLabel,
  InfoValue,
  InfoWrapper,
} from "components/Base/Boxes/StyledBoxes";
import {
  BaseDialogContentWrapper,
  BaseDialogDescription,
  BaseDialogWrapperLight,
} from "components/Base/Dialog/StyledDialog";
import {
  BaseButtonPrimary,
  BaseCancelButton,
} from "components/Base/Buttons/StyledButtons";

const UnstakeGrid = styled(Grid)`
  width: auto;
  &.MuiGrid-container {
    margin: 20px 0;
    padding: 0;
  }
`;

const ConfirmButton = styled(BaseButtonPrimary)`
  width: 100%;
  height: 48px;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
`;

const InfoLabelError = styled(InfoLabel)`
  color: #f76e6e;
`;

const InfoValueError = styled(InfoValue)`
  color: #f76e6e;
`;

export type EarlyUnstakeDialogProps = {
  token: string;
  lockPosition: ILockPosition;
  onClose: () => void;
  onFinish: (unstakeAmount: number) => void;
};

const EarlyUnstakeDialog: FC<EarlyUnstakeDialogProps> = ({
  onClose,
  token,
  lockPosition,
  onFinish,
}) => {
  const {
    unstakeAmount,
    penaltyFee,
    unstakeAmountWithFee,
    isLoading,
    earlyUnstakeHandler,
    penaltyFeePercent,
  } = useEarlyUnstake(lockPosition, onFinish);
  const { isMobile } = useSharedContext();

  return (
    <BaseDialogWrapperLight
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      data-testid="dao-early-unstake-dialog"
    >
      <BaseDialogTitle
        id="customized-dialog-title"
        onClose={onClose}
        data-testid="dao-early-unstake-dialog-title"
      >
        Early Unstake
      </BaseDialogTitle>

      <DialogContent>
        <BaseDialogDescription data-testid="dao-early-unstake-dialog-description">
          You will be unstaking the position since unstaking early can exhause
          the pool sharing and penalty fee will apply based your locking period
          left.
        </BaseDialogDescription>
        <BaseDialogContentWrapper data-testid="dao-early-unstake-dialog-requesting-unstake-content">
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>
            You’re requesting to unstake early
          </Box>
          <Box className={"amount"}>
            <Box>{formatPercentage(unstakeAmount / 10 ** 18)}</Box>
            <span>{token}</span>
          </Box>
        </BaseDialogContentWrapper>
        <UnstakeGrid container>
          <Grid item xs={12}>
            <InfoWrapper>
              <InfoLabel>You locked</InfoLabel>
              <InfoValue>
                {formatPercentage(unstakeAmount / 10 ** 18)} {token}
              </InfoValue>
            </InfoWrapper>
            <InfoWrapper>
              <InfoLabelError>Penalty Fee</InfoLabelError>
              <InfoValueError>
                {formatPercentage(penaltyFee / 10 ** 18)} {token} (
                {formatPercentage(penaltyFeePercent)}%)
              </InfoValueError>
            </InfoWrapper>
            <InfoWrapper>
              <InfoLabel>You'll receive</InfoLabel>
              <InfoValue>
                {formatPercentage(unstakeAmountWithFee / 10 ** 18)} {token}
              </InfoValue>
            </InfoWrapper>
          </Grid>
        </UnstakeGrid>
        <BaseWarningBox>
          <InfoIcon sx={{ fontSize: "18px" }} />
          <Typography>Penalty fee will be applied.</Typography>
        </BaseWarningBox>
        <ButtonsWrapper>
          {!isMobile && (
            <BaseCancelButton onClick={onClose}>Cancel</BaseCancelButton>
          )}
          <ConfirmButton
            disabled={isLoading}
            isLoading={isLoading}
            onClick={earlyUnstakeHandler}
          >
            {isLoading ? <CircularProgress size={30} /> : "Yes, Unstake"}
          </ConfirmButton>
          {isMobile && (
            <BaseCancelButton onClick={onClose}>Cancel</BaseCancelButton>
          )}
        </ButtonsWrapper>
        <BaseInfoBox sx={{ marginTop: "20px" }}>
          <InfoIcon sx={{ fontSize: "18px" }} />
          <Typography>
            Proceeding will prompt you to sign 1 txn in MetaMask.
          </Typography>
        </BaseInfoBox>
      </DialogContent>
    </BaseDialogWrapperLight>
  );
};

export default memo(EarlyUnstakeDialog);
