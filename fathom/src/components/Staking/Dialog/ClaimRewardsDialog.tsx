import {
  AppDialog,
  DialogContentWrapper
} from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  Box,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";
import {
  ButtonPrimary,
  CancelButton,
  SkipButton,
} from "components/AppComponents/AppButton/AppButton";
import React, { FC, useCallback, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import InfoIcon from "@mui/icons-material/Info";
import useStakingView from "hooks/useStakingView";
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

const ConfirmButton = styled(ButtonPrimary)`
  width: 100%;
  height: 48px;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
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
  }
`;

export enum ClaimRewardsType {
  ITEM,
  FUll,
}

type ClaimRewardsDialogProps = {
  totalRewards: number;
  token: string;
  onClose: () => void;
  onSkip?: () => void;
  type?: ClaimRewardsType;
};

const ClaimRewardsDialog: FC<ClaimRewardsDialogProps> = ({
  totalRewards,
  token,
  onClose,
  onSkip,
}) => {
  const { claimRewards, action } = useStakingView();

  const claimRewardsHandler = useCallback(() => {
    claimRewards().then(() => {
      onClose();
    });
  }, [claimRewards, onClose]);

  const isLoading = useMemo(() => action?.type === "claim", [action]);

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
        Claim Rewards
      </AppDialogTitle>

      <DialogContent>
        <Description>
          Claim Rewards only is available for all positions at the moment. You
          will lose the rewards of the position you proceed to unstake without
          claiming it here first. <a href={'/'}>Learn more.</a>
        </Description>
        <DialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>You’re requesting to claim</Box>
          <Box className={'amount'}>
            <Box>{formatNumber(totalRewards)}</Box>
            <span>{token}</span>
          </Box>
        </DialogContentWrapper>
        <ButtonsWrapper>
          {onSkip ? (
            <SkipButton onClick={onSkip}>Skip</SkipButton>
          ) : (
            <CancelButton onClick={onClose}>Cancel</CancelButton>
          )}

          <ConfirmButton
            disabled={isLoading}
            isLoading={isLoading}
            onClick={claimRewardsHandler}
          >
            {isLoading ? <CircularProgress size={30} /> : "Claim All Rewards"}
          </ConfirmButton>
        </ButtonsWrapper>
        <InfoMessageWrapper>
          <InfoIcon sx={{ fontSize: "18px", color: "#4F658C" }} />
          <Typography>
            Proceeding will prompt you to sign 1 txn in MetaMask.
          </Typography>
        </InfoMessageWrapper>
      </DialogContent>
    </AppDialog>
  );
};

export default ClaimRewardsDialog;
