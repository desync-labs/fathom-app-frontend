import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  Box,
  CircularProgress,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import React, { FC, useCallback, useMemo } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import InfoIcon from "@mui/icons-material/Info";
import useStakingView from "../../../hooks/useStakingView";

const DialogContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px 0 30px;
`;

const Amount = styled(Box)`
  font-weight: 600;
  font-size: 36px;
  line-height: 40px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 7px;

  span {
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    color: #fff;
  }
`;

const InfoWrapper = styled(Box)`
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

const ConfirmButton = styled(ButtonPrimary)`
  width: 100%;
  height: 48px;
`;

export enum ClaimRewardsType {
  ITEM,
  FUll,
}

export type ClaimRewardsAll = {
  totalRewards?: number;
  rewardsToken?: string;
};

type ClaimRewardsDialogProps = {
  lockPosition: ILockPosition | null;
  totalRewards: ClaimRewardsAll | null;
  onClose: () => void;
  type: ClaimRewardsType;
};

const ClaimRewardsDialog: FC<ClaimRewardsDialogProps> = ({
  onClose,
  lockPosition,
  totalRewards,
  type = ClaimRewardsType.ITEM,
}) => {
  const { claimRewardsSingle, claimRewards, action } = useStakingView();

  const claimRewardsHandler = useCallback(async () => {
    if (type === ClaimRewardsType.ITEM) {
      // @ts-ignore
      claimRewardsSingle(lockPosition?.lockId).then(() => {
        onClose();
      });
    }
  }, [lockPosition, claimRewardsSingle]);

  const isLoading = useMemo(
    () =>
      type === ClaimRewardsType.ITEM
        ? // @ts-ignore
          action?.type === "claimSingle" && action?.id === lockPosition?.lockId
        : action?.type === "claim",
    [action]
  );

  return (
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      color="primary"
      sx={{ '.MuiPaper-root':  { maxWidth: "500px" } }}
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Claim Rewards
      </AppDialogTitle>

      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <DialogContentWrapper>
              <img
                src={getTokenLogoURL("FTHM")}
                alt={"token-logo"}
                width={58}
              />
              <Box>You’re claiming</Box>
              <Amount>
                <Box>
                  {type === ClaimRewardsType.ITEM
                    ? lockPosition?.RewardsAvailable
                    : totalRewards?.totalRewards}
                </Box>
                <span>
                  {type === ClaimRewardsType.ITEM
                    ? "FTHM"
                    : totalRewards?.rewardsToken}
                </span>
              </Amount>
            </DialogContentWrapper>
            <InfoWrapper>
              <InfoIcon sx={{ fontSize: "18px", color: "#4F658C" }} />
              <Typography>
                By clicking “Confirm”, you’ll be withdrawing this amount to your
                connected wallet.
              </Typography>
            </InfoWrapper>
          </Grid>

          <Grid item xs={12}>
            <ConfirmButton
              disabled={isLoading}
              isLoading={isLoading}
              onClick={claimRewardsHandler}
            >
              {isLoading ? <CircularProgress size={30} /> : "Confirm"}
            </ConfirmButton>
          </Grid>
        </Grid>
      </DialogContent>
    </AppDialog>
  );
};

export default ClaimRewardsDialog;
