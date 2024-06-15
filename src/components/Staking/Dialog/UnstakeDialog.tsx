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
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import {
  InfoLabel,
  InfoValue,
  InfoWrapper,
  WalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import InfoIcon from "@mui/icons-material/Info";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  ButtonPrimary,
  CancelButton,
  MaxButton,
} from "components/AppComponents/AppButton/AppButton";
import useUnstake from "hooks/Staking/useUnstake";
import {
  ButtonsWrapper,
  InfoMessageWrapper,
} from "components/Staking/Dialog/ClaimRewardsDialog";
import { formatNumber, formatPercentage } from "utils/format";
import BigNumber from "bignumber.js";
import useSharedContext from "context/shared";

const UnStakeDialogWrapper = styled(AppDialog)`
  .MuiGrid-container {
    margin: 0 17px 15px 17px;
    padding: 10px 0 30px 0;
  }
`;

const UnStakeGrid = styled(Grid)`
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

const ErrorWrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 7px;
  padding-top: 2px;
  & > * {
    font-size: 13px;
  }
`;

export type UnStakeDialogProps = {
  lockPosition: ILockPosition | null;
  token: string;
  onClose: () => void;
  onFinish: (unstakeAmount: number) => void;
};

const UnStakeDialog: FC<UnStakeDialogProps> = ({
  onClose,
  token,
  lockPosition,
  onFinish,
}) => {
  const {
    balanceError,
    requiredError,
    unStakeAmount,
    totalBalance,
    isLoading,
    handleUnStakeAmountChange,
    setMax,
    unStakeHandler,
  } = useUnstake(lockPosition, onFinish);
  const { isMobile } = useSharedContext();

  return (
    <UnStakeDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Unstake
      </AppDialogTitle>

      <DialogContent>
        <UnStakeGrid container>
          <Grid item xs={12}>
            <AppFormInputWrapper>
              <AppFormLabel>Unstake amount</AppFormLabel>
              <WalletBalance>
                Available:{" "}
                {formatPercentage(
                  BigNumber(totalBalance)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )}{" "}
                {token}
              </WalletBalance>
              <AppTextField
                error={balanceError || requiredError}
                id="outlined-helperText"
                helperText={
                  <>
                    {balanceError && (
                      <ErrorWrapper>
                        <InfoIcon />
                        <Typography>You do not have enough {token}</Typography>
                      </ErrorWrapper>
                    )}
                    {requiredError && (
                      <ErrorWrapper>
                        <InfoIcon />
                        <Typography>Unstake amount is required</Typography>
                      </ErrorWrapper>
                    )}
                  </>
                }
                value={unStakeAmount}
                placeholder="0"
                onChange={handleUnStakeAmountChange}
              />
              <AppFormInputLogo src={getTokenLogoURL(token)} />
              <MaxButton onClick={() => setMax()}>Max</MaxButton>
            </AppFormInputWrapper>
          </Grid>
        </UnStakeGrid>

        <DialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>You’re requesting to unstake</Box>
          <Box className={"amount"}>
            <Box>
              {unStakeAmount ? formatPercentage(Number(unStakeAmount)) : "--"}
            </Box>
            <span>{token}</span>
          </Box>
        </DialogContentWrapper>
        <UnStakeGrid
          container
          sx={{ "&.MuiGrid-container": { marginBottom: "20px" } }}
        >
          <Grid item xs={12}>
            <InfoWrapper>
              <InfoLabel>
                You locked
                <InfoIcon sx={{ fontSize: "18px", color: "#6379A1" }} />
              </InfoLabel>
              <InfoValue>
                {formatPercentage(
                  BigNumber(totalBalance)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )}{" "}
                {token}
              </InfoValue>
            </InfoWrapper>
            <InfoWrapper>
              <InfoLabel>
                You'll received
                <InfoIcon sx={{ fontSize: "18px", color: "#6379A1" }} />
              </InfoLabel>
              <InfoValue>
                {unStakeAmount ? formatNumber(Number(unStakeAmount)) : "--"}{" "}
                {token}
              </InfoValue>
            </InfoWrapper>
          </Grid>
        </UnStakeGrid>
        <ButtonsWrapper>
          {!isMobile && <CancelButton onClick={onClose}>Cancel</CancelButton>}
          <ConfirmButton
            disabled={isLoading}
            isLoading={isLoading}
            onClick={unStakeHandler}
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
    </UnStakeDialogWrapper>
  );
};

export default memo(UnStakeDialog);
