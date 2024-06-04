import { FC, memo } from "react";
import {
  AppDialog,
  DialogContentWrapper,
} from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { Box, DialogContent, Typography } from "@mui/material";
import {
  ButtonPrimary,
  SkipButton,
} from "components/AppComponents/AppButton/AppButton";
import { ILockPosition } from "fathom-sdk";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import InfoIcon from "@mui/icons-material/Info";
import { formatPercentage } from "utils/format";
import { ModalDescription } from "components/AppComponents/AppBox/AppBox";
import { WarningBlock } from "components/Staking/Dialog/EarlyUnstakeDialog";
import useSharedContext from "context/shared";
import { ButtonsWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";

const ConfirmButton = styled(ButtonPrimary)`
  width: 100%;
  height: 48px;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
`;

type ClaimRewardsDialogProps = {
  position: ILockPosition;
  token: string;
  onClose: () => void;
  onSkip: () => void;
  onClaim: () => void;
};

const UnclaimedRewardsDialog: FC<ClaimRewardsDialogProps> = ({
  position,
  token,
  onClose,
  onSkip,
  onClaim,
}) => {
  const { isMobile } = useSharedContext();

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
        <ModalDescription>
          If you unstake before claiming rewards, you will lose them. <br />
          Claim rewards first in My Stats, then Unstake later.
        </ModalDescription>
        <DialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>You’re having unclaimed rewards</Box>
          <Box className={"amount"}>
            <Box>
              {formatPercentage(Number(position.rewardsAvailable / 10 ** 18))}
            </Box>
            <span>{token}</span>
          </Box>
        </DialogContentWrapper>
        <WarningBlock>
          <InfoIcon sx={{ fontSize: "18px", color: "#F5953D" }} />
          <Typography component={"span"}>
            You will lose the reward of this position if you proceed to unstake
            it without claiming the rewards first.
          </Typography>
        </WarningBlock>
        <ButtonsWrapper>
          {!isMobile && <SkipButton onClick={onSkip}>Skip</SkipButton>}
          <ConfirmButton onClick={onClaim}>Claim All Rewards</ConfirmButton>
          {isMobile && <SkipButton onClick={onSkip}>Skip</SkipButton>}
        </ButtonsWrapper>
      </DialogContent>
    </AppDialog>
  );
};

export default memo(UnclaimedRewardsDialog);
