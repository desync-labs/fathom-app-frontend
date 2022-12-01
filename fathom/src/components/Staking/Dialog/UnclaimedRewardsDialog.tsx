import {
  AppDialog,
  DialogContentWrapper
} from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  Box,
  DialogContent,
  Typography,
} from "@mui/material";
import {
  ButtonPrimary,
  SkipButton
} from "components/AppComponents/AppButton/AppButton";
import React, { FC } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import InfoIcon from "@mui/icons-material/Info";
import { formatNumber } from "utils/format";

const WarningBlock = styled(Box)`
  background: #452508;
  border: 1px solid #5C310A;
  border-radius: 8px;
  color: #F7B06E;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 12px;
  font-size: 14px;
  margin: 0 15px 40px 15px;
`
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
  color: #FFFFFF;
  padding: 0 15px;
`

const ButtonsWrapper = styled(Box)`
  width: auto;
  margin: 20px 15px;
  display: flex;
  gap: 6px;
  align-items: center;
  
  > button {
    width: calc(50% - 3px);
  }
`

type ClaimRewardsDialogProps = {
  position: ILockPosition;
  token: string;
  onClose: () => void;
  onSkip: () => void;
  onClaim: () => void
};

const UnclaimedRewardsDialog: FC<ClaimRewardsDialogProps> = ({
  position,
  token,
  onClose,
  onSkip,
  onClaim
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
        You have unclaimed rewards!
      </AppDialogTitle>

      <DialogContent>
        <Description>
          If you unstake before claiming rewards, you will lose them. Claim rewards first in My Stats, then Unstake later.
        </Description>
        <DialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: '18px' }}>You’re having unclaimed rewards</Box>
          <Box className={'amount'}>
            <Box>{formatNumber(Number(position.RewardsAvailable))}</Box>
            <span>{token}</span>
          </Box>
        </DialogContentWrapper>
        <WarningBlock>
          <InfoIcon sx={{ fontSize: "18px", color: '#F5953D' }} />
          <Typography component={'span'}>
            Penalty fee will be applied.
          </Typography>
        </WarningBlock>
        <ButtonsWrapper>
          <SkipButton onClick={onSkip}>Skip</SkipButton>
          <ConfirmButton onClick={onClaim}>
            Claim All Rewards
          </ConfirmButton>
        </ButtonsWrapper>
      </DialogContent>
    </AppDialog>
  );
};

export default UnclaimedRewardsDialog;
