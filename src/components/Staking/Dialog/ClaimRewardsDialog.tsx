import { FC, memo, useMemo } from "react";
import {
  AppDialog,
  DialogContentWrapper,
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
import { ModalDescription } from "components/AppComponents/AppBox/AppBox";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import InfoIcon from "@mui/icons-material/Info";
import { formatPercentage } from "utils/format";
import useStakingContext from "context/staking";
import BigNumber from "bignumber.js";
import useSharedContext from "context/shared";

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

export const ButtonsWrapper = styled(Box)<{ singleBtn?: boolean }>`
  width: auto;
  margin: 20px 15px;
  display: flex;
  gap: 6px;
  align-items: center;

  > button {
    height: 48px;
    width: ${({ singleBtn }) => (singleBtn ? "100%" : "calc(50% - 3px)")};
    height: 48px;
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
        <ModalDescription>
          Claim Rewards only is available for all positions at the moment.{" "}
          <br />
          You will lose the rewards of the position you proceed to unstake
          without claiming it here first.
        </ModalDescription>
        <DialogContentWrapper>
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
        </DialogContentWrapper>
        <ButtonsWrapper>
          {!isMobile &&
            (onSkip ? (
              <SkipButton onClick={onSkip}>Skip</SkipButton>
            ) : (
              <CancelButton onClick={onClose}>Cancel</CancelButton>
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
              <SkipButton onClick={onSkip}>Skip</SkipButton>
            ) : (
              <CancelButton onClick={onClose}>Cancel</CancelButton>
            ))}
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

export default memo(ClaimRewardsDialog);
