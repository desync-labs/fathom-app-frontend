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
import React, { FC } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import { StakingViewItemLabel } from "components/Staking/StakingViewItem";
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
  MaxButton,
} from "components/AppComponents/AppButton/AppButton";
import useUnstake from "hooks/useUnstake";
import { InfoMessageWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";
import { formatNumber } from "../../../utils/format";

const UnstakeValue = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 16px;
  gap: 7px;
  strong {
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #9fadc6;
  }
`;

const UnstakeLabel = styled(StakingViewItemLabel)`
  padding-bottom: 7px;
  font-size: 11px;
`;

const UnstakeDialogWrapper = styled(AppDialog)`
  .MuiPaper-root {
    maxwidth: 600px;
  }
  .MuiGrid-container {
    margin: 0 17px 15px 17px;
    padding: 10px 0 30px 0;
  }
`;

const UnstakeBalanceWrapper = styled(Grid)`
  border-bottom: 1px solid #324567;
  width: auto;
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

type UnstakeDialogProps = {
  lockPosition: ILockPosition | null;
  token: string;
  onClose: () => void;
};

const UnstakeDialog: FC<UnstakeDialogProps> = ({
  onClose,
  token,
  lockPosition,
}) => {
  const {
    balanceError,
    unStakeAmount,
    totalBalance,

    isLoading,

    handleUnStakeAmountChange,
    setMax,
    unStakeHandler,
  } = useUnstake(lockPosition);

  return (
    <UnstakeDialogWrapper
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
        <UnstakeGrid container>
          <Grid item xs={12}>
            <AppFormInputWrapper>
              <AppFormLabel>Unstake amount</AppFormLabel>
              <WalletBalance>
                Available: {formatNumber(totalBalance)} {token}
              </WalletBalance>
              <AppTextField
                error={balanceError}
                id="outlined-helperText"
                helperText={
                  balanceError ? (
                    <>
                      <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                      <Typography
                        sx={{ fontSize: "12px", paddingLeft: "22px" }}
                      >
                        You do not have enough {token}
                      </Typography>
                    </>
                  ) : null
                }
                value={unStakeAmount}
                onChange={handleUnStakeAmountChange}
              />
              <AppFormInputLogo src={getTokenLogoURL(token)} />
              <MaxButton onClick={() => setMax()}>Max</MaxButton>
            </AppFormInputWrapper>
          </Grid>
        </UnstakeGrid>

        <DialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>You’re requesting to unstake</Box>
          <Box className={"amount"}>
            <Box>
              {unStakeAmount ? formatNumber(Number(unStakeAmount)) : "--"}
            </Box>
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
                {formatNumber(totalBalance)} {token}
              </InfoValue>
            </InfoWrapper>
            <InfoWrapper>
              <InfoLabel>
                Maximum Received
                <InfoIcon sx={{ fontSize: "18px", color: "#6379A1" }} />
              </InfoLabel>
              <InfoValue>
                {formatNumber(totalBalance)} {token}
              </InfoValue>
            </InfoWrapper>
          </Grid>
        </UnstakeGrid>
        <InfoMessageWrapper>
          <InfoIcon sx={{ fontSize: "18px", color: "#4F658C" }} />
          <Typography>
            By clicking “Confirm Unstake”, you’ll be signing 2 transactions in
            MetaMask to withdraw this amount to your connected wallet, and to
            unlock the position.
          </Typography>
        </InfoMessageWrapper>
        <UnstakeGrid container>
          <Grid item xs={12}>
            <ConfirmButton
              disabled={isLoading}
              isLoading={isLoading}
              onClick={unStakeHandler}
            >
              {isLoading ? <CircularProgress size={30} /> : "Confirm Unstake"}
            </ConfirmButton>
          </Grid>
        </UnstakeGrid>
      </DialogContent>
    </UnstakeDialogWrapper>
  );
};

export default UnstakeDialog;
