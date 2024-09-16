import { FC, memo } from "react";
import { Box, DialogContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { ILockPosition } from "fathom-sdk";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";
import useSharedContext from "context/shared";

import { ButtonsWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";
import { BaseWarningBox } from "components/Base/Boxes/StyledBoxes";
import { BaseDialogTitle } from "components/Base/Dialog/BaseDialogTitle";
import {
  BaseDialogContentWrapper,
  BaseDialogDescription,
  BaseDialogWrapperLight,
} from "components/Base/Dialog/StyledDialog";
import {
  BaseButtonPrimary,
  BaseSkipButton,
} from "components/Base/Buttons/StyledButtons";

const ConfirmButton = styled(BaseButtonPrimary)`
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
    <BaseDialogWrapperLight
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
    >
      <BaseDialogTitle id="customized-dialog-title" onClose={onClose}>
        You have unclaimed rewards!
      </BaseDialogTitle>

      <DialogContent>
        <BaseDialogDescription>
          If you unstake before claiming rewards, you will lose them. <br />
          Claim rewards first in My Stats, then unstake later.
        </BaseDialogDescription>
        <BaseDialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>You’re having unclaimed rewards</Box>
          <Box className={"amount"}>
            <Box>
              {formatPercentage(Number(position.rewardsAvailable / 10 ** 18))}
            </Box>
            <span>{token}</span>
          </Box>
        </BaseDialogContentWrapper>
        <BaseWarningBox>
          <InfoIcon sx={{ fontSize: "18px" }} />
          <Typography>
            You will lose the reward of this position if you proceed to unstake
            it without claiming the rewards first.
          </Typography>
        </BaseWarningBox>
        <ButtonsWrapper>
          {!isMobile && <BaseSkipButton onClick={onSkip}>Skip</BaseSkipButton>}
          <ConfirmButton onClick={onClaim}>Claim All Rewards</ConfirmButton>
          {isMobile && <BaseSkipButton onClick={onSkip}>Skip</BaseSkipButton>}
        </ButtonsWrapper>
      </DialogContent>
    </BaseDialogWrapperLight>
  );
};

export default memo(UnclaimedRewardsDialog);
