import { FC, memo } from "react";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  Box,
  CircularProgress,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import {
  AppDialog,
  DialogContentWrapper,
} from "components/AppComponents/AppDialog/AppDialog";
import { ILockPosition } from "fathom-sdk";
import { styled } from "@mui/material/styles";
import {
  InfoLabel,
  InfoValue,
  InfoWrapper,
  ModalDescription,
} from "components/AppComponents/AppBox/AppBox";
import InfoIcon from "@mui/icons-material/Info";
import {
  ButtonPrimary,
  CancelButton,
} from "components/AppComponents/AppButton/AppButton";
import useEarlyUnstake from "hooks/Staking/useEarlyUnstake";
import {
  ButtonsWrapper,
  InfoMessageWrapper,
} from "components/Staking/Dialog/ClaimRewardsDialog";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";
import useSharedContext from "context/shared";

const UnstakeGrid = styled(Grid)`
  width: auto;
  &.MuiGrid-container {
    margin: 0 17px;
    padding: 10px 0;

    ${({ theme }) => theme.breakpoints.down("sm")} {
      margin: 0;
    }
  }
`;

const ConfirmButton = styled(ButtonPrimary)`
  width: 100%;
  height: 48px;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
`;

export const WarningBlock = styled(Box)`
  background: #452508;
  border: 1px solid #5c310a;
  border-radius: 8px;
  color: #f7b06e;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 12px;
  font-size: 14px;
  margin: 20px 15px 25px 15px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: 20px 0 25px 0;
  }
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
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      color="primary"
      data-testid="dao-early-unstake-dialog"
    >
      <AppDialogTitle
        id="customized-dialog-title"
        onClose={onClose}
        data-testid="dao-early-unstake-dialog-title"
      >
        Early Unstake
      </AppDialogTitle>

      <DialogContent>
        <ModalDescription data-testid="dao-early-unstake-dialog-description">
          Position lock time has not yet passed - by requesting <br />
          Early Unstake - you will pay the penalty. <br />
          Ensure you Claim Rewards before Unstaking so as not to lose your
          rewards.
        </ModalDescription>
        <DialogContentWrapper data-testid="dao-early-unstake-dialog-requesting-unstake-content">
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box>You’re requesting to unstake</Box>
          <Box className={"amount"}>
            <Box>{formatPercentage(unstakeAmount / 10 ** 18)}</Box>
            <span>{token}</span>
          </Box>
        </DialogContentWrapper>

        <UnstakeGrid
          container
          sx={{ "&.MuiGrid-container": { marginBottom: "20px" } }}
        >
          <Grid item xs={12}>
            <InfoWrapper>
              <InfoLabel>
                Total Available
                <InfoIcon sx={{ fontSize: "18px", color: "#6379A1" }} />
              </InfoLabel>
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
              <InfoLabel>
                Maximum Received
                <InfoIcon sx={{ fontSize: "18px", color: "#6379A1" }} />
              </InfoLabel>
              <InfoValue>
                {formatPercentage(unstakeAmountWithFee / 10 ** 18)} {token}
              </InfoValue>
            </InfoWrapper>
          </Grid>
        </UnstakeGrid>
        <WarningBlock>
          <InfoIcon sx={{ fontSize: "18px", color: "#F5953D" }} />
          <Typography component={"span"} fontSize="1rem">
            Penalty fee will be applied.
          </Typography>
        </WarningBlock>
        <ButtonsWrapper>
          {!isMobile && <CancelButton onClick={onClose}>Cancel</CancelButton>}
          <ConfirmButton
            disabled={isLoading}
            isLoading={isLoading}
            onClick={earlyUnstakeHandler}
          >
            {isLoading ? <CircularProgress size={30} /> : "Yes, Unstake"}
          </ConfirmButton>
          {isMobile && <CancelButton onClick={onClose}>Cancel</CancelButton>}
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

export default memo(EarlyUnstakeDialog);
