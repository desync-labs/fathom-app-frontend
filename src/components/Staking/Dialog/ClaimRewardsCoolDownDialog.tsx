import { FC, memo } from "react";
import { Box, DialogContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import BigNumber from "bignumber.js";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";
import useSharedContext from "context/shared";
import { BaseDialogTitle } from "components/Base/Dialog/BaseDialogTitle";
import {
  BaseDialogContentWrapper,
  BaseDialogDescription,
  BaseDialogWrapperLight,
} from "components/Base/Dialog/StyledDialog";
import {
  BaseButtonPrimary,
  BaseCancelButton,
} from "components/Base/Buttons/StyledButtons";

const ButtonsWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "onContinue",
})<{ onContinue?: boolean }>`
  width: auto;
  margin: 20px 15px;
  display: flex;
  gap: 6px;
  align-items: center;

  > button {
    width: ${({ onContinue }) => (onContinue ? "calc(50% - 3px)" : "100%")};
    height: 48px;
  }

  ${({ theme, onContinue }) =>
    onContinue ? theme.breakpoints.down("sm") : null} {
    flex-direction: column;
    button {
      width: 100%;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: 20px 0;
  }
`;

const ConfirmButton = styled(BaseButtonPrimary)`
  height: 48px;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
`;

type ClaimRewardsDialogProps = {
  totalRewards: string;
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
        Claim Rewards Cooling Down ...
      </BaseDialogTitle>

      <DialogContent>
        <BaseDialogDescription>
          You successfully requested to claim rewards. Now it's going to a
          “Cooldown" period for 5 days. After this period, you'll be able to
          Withdraw it at My Stats &gt; Ready to Withdraw.
        </BaseDialogDescription>
        <BaseDialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>You’re requesting to claim</Box>
          <Box className={"amount"}>
            <Box>
              {formatPercentage(
                BigNumber(totalRewards)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}
            </Box>
            <span>{token}</span>
          </Box>
        </BaseDialogContentWrapper>
        <ButtonsWrapper onContinue={!!onContinue}>
          {!isMobile && (
            <BaseCancelButton onClick={onClose}>
              Back to My Positions
            </BaseCancelButton>
          )}
          {onContinue && (
            <ConfirmButton onClick={onContinue}>
              Continue to Unstake
            </ConfirmButton>
          )}
          {isMobile && (
            <BaseCancelButton onClick={onClose}>
              Back to My Positions
            </BaseCancelButton>
          )}
        </ButtonsWrapper>
      </DialogContent>
    </BaseDialogWrapperLight>
  );
};

export default memo(ClaimRewardsCoolDownDialog);
