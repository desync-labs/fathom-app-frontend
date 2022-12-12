import {
  AppDialog,
  DialogContentWrapper,
} from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { Box, DialogContent, Typography } from "@mui/material";
import {
  ButtonPrimary,
  CancelButton,
} from "components/AppComponents/AppButton/AppButton";
import React, { FC } from "react";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";

export const InfoMessageWrapper = styled(Box)`
  display: flex;
  align-items: start;
  gap: 5px;
  padding: 0 12px;
  p {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #9fadc6;
    margin-bottom: 20px;
  }

  svg {
    margin-top: 2px;
  }
`;

const Description = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  padding: 0 15px;
`;

const ButtonsWrapper = styled(Box)`
  width: auto;
  margin: 20px 15px;
  display: flex;
  gap: 6px;
  align-items: center;

  > button {
    width: calc(50% - 3px);
    height: 48px;
  }
`;

type ClaimRewardsDialogProps = {
  totalRewards: number;
  token: string;
  onClose: () => void;
  onContinue: (() => void) | null;
};

const ClaimRewardsCoolDownDialog: FC<ClaimRewardsDialogProps> = ({
  totalRewards,
  token,
  onClose,
  onContinue,
}) => {
  return (
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      color="primary"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Claim Rewards Cooling Down ...
      </AppDialogTitle>

      <DialogContent>
        <Description>
          You successfully requested to claim rewards. Now it's going to a
          “Cooldown" period for 2 days. After this period, you'll be able to
          Withdraw it at My Stats &gt; Ready to Withdraw.
        </Description>
        <DialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>You’re requesting to claim</Box>
          <Box className={"amount"}>
            <Box>{formatNumber(totalRewards / 10 ** 18)}</Box>
            <span>{token}</span>
          </Box>
        </DialogContentWrapper>
        <ButtonsWrapper>
          <CancelButton
            sx={{ width: onContinue ? "calc(50% - 3px)" : "100%" }}
            onClick={onClose}
          >
            Back to My Positions
          </CancelButton>
          {onContinue && (
            <ButtonPrimary onClick={onContinue}>
              Continue to Unstake
            </ButtonPrimary>
          )}
        </ButtonsWrapper>
      </DialogContent>
    </AppDialog>
  );
};

export default ClaimRewardsCoolDownDialog;
