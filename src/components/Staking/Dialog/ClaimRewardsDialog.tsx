import { FC, memo, useMemo } from "react";
import {
  Box,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import BigNumber from "bignumber.js";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";
import useStakingContext from "context/staking";
import useSharedContext from "context/shared";
import { BaseInfoBox } from "components/Base/Boxes/StyledBoxes";
import { BaseDialogTitle } from "components/Base/Dialog/BaseDialogTitle";
import {
  BaseDialogContentWrapper,
  BaseDialogDescription,
  BaseDialogWrapperLight,
} from "components/Base/Dialog/StyledDialog";
import {
  BaseButtonPrimary,
  BaseCancelButton,
  BaseSkipButton,
} from "components/Base/Buttons/StyledButtons";

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

const ConfirmButton = styled(BaseButtonPrimary)`
  width: 100%;
  height: 48px;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
`;

export const ButtonsWrapper = styled(Box)<{ singleBtn?: boolean }>`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;

  ${({ singleBtn }) => (singleBtn ? "margin: 20px 0 0;" : "margin: 40px 0 0;")};

  > button {
    height: 48px;
    width: auto;
    padding: 8px 32px;
    ${({ theme }) => theme.breakpoints.down("sm")} {
      width: 100%;
    }

    &:first-child {
      ${({ singleBtn }) =>
        singleBtn ? "width: 100%;" : "flex-grow: 0; flex-shrink: 0;"};
    }

    &:last-child {
      ${({ singleBtn }) => !singleBtn && "flex-grow: 1;"};
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    button {
      width: 100%;
    }
    margin: 20px 0;
  }
`;

type ClaimRewardsDialogProps = {
  totalRewards: string;
  token: string;
  onClose: () => void;
  onSkip: (() => any) | null;
  onClaim: () => void;
};

const ClaimRewardsDialog: FC<ClaimRewardsDialogProps> = ({
  totalRewards,
  token,
  onClose,
  onSkip,
  onClaim,
}) => {
  const { claimRewards, action } = useStakingContext();
  const { isMobile } = useSharedContext();

  const isLoading = useMemo(() => action?.type === "claim", [action]);

  return (
    <BaseDialogWrapperLight
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
    >
      <BaseDialogTitle id="customized-dialog-title" onClose={onClose}>
        Claim Rewards
      </BaseDialogTitle>

      <DialogContent>
        <BaseDialogDescription>
          Claim Rewards only is available for all positions at the moment. You
          will lose the rewards of the position you proceed to unstake without
          claiming it here first.
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
        <ButtonsWrapper>
          {!isMobile &&
            (onSkip ? (
              <BaseSkipButton onClick={onSkip}>Skip</BaseSkipButton>
            ) : (
              <BaseCancelButton onClick={onClose}>Cancel</BaseCancelButton>
            ))}

          <ConfirmButton
            disabled={isLoading}
            isLoading={isLoading}
            onClick={() => claimRewards(onClaim)}
          >
            {isLoading ? <CircularProgress size={30} /> : "Claim All Rewards"}
          </ConfirmButton>

          {isMobile &&
            (onSkip ? (
              <BaseSkipButton onClick={onSkip}>Skip</BaseSkipButton>
            ) : (
              <BaseCancelButton onClick={onClose}>Cancel</BaseCancelButton>
            ))}
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

export default memo(ClaimRewardsDialog);
