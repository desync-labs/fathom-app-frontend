import { FC } from "react";
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
import useEarlyUnstake from "hooks/useEarlyUnstake";
import { InfoMessageWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";
import useStakingContext from "context/staking";

const UnstakeDialogWrapper = styled(AppDialog)`
  .MuiGrid-container {
    margin: 0 17px 15px 17px;
    padding: 10px 0 30px 0;
  }
`;

const UnstakeGrid = styled(Grid)`
  width: auto;
  &.MuiGrid-container {
    margin: 0 17px;
    padding: 10px 0;
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
`;

const InfoLabelError = styled(InfoLabel)`
  color: #f76e6e;
`;

const InfoValueError = styled(InfoValue)`
  color: #f76e6e;
`;

const ButtonsWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 15px;

  > button {
    width: calc(50% - 3px);
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    button {
      width: 100%;
    }
  }
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
  const { isMobile } = useStakingContext();

  return (
    <UnstakeDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Early Unstake
      </AppDialogTitle>

      <DialogContent>
        <ModalDescription>
          Position lock time has not yet passed - by requesting Early Unstake -
          you will pay the penalty. <br />
          Ensure you Claim Rewards before Unstaking so as not to lose your
          rewards.
        </ModalDescription>
        <DialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box>You’re requesting to unstake</Box>
          <Box className={"amount"}>
            <Box>{formatNumber(unstakeAmount / 10 ** 18)}</Box>
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
                {formatNumber(unstakeAmount / 10 ** 18)} {token}
              </InfoValue>
            </InfoWrapper>
            <InfoWrapper>
              <InfoLabelError>Penalty Fee</InfoLabelError>
              <InfoValueError>
                {formatNumber(penaltyFee / 10 ** 18)} {token} (
                {formatNumber(penaltyFeePercent)}%)
              </InfoValueError>
            </InfoWrapper>
            <InfoWrapper>
              <InfoLabel>
                Maximum Received
                <InfoIcon sx={{ fontSize: "18px", color: "#6379A1" }} />
              </InfoLabel>
              <InfoValue>
                {formatNumber(unstakeAmountWithFee / 10 ** 18)} {token}
              </InfoValue>
            </InfoWrapper>
          </Grid>
        </UnstakeGrid>
        <WarningBlock>
          <InfoIcon sx={{ fontSize: "18px", color: "#F5953D" }} />
          <Typography component={"span"}>
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
    </UnstakeDialogWrapper>
  );
};

export default EarlyUnstakeDialog;
