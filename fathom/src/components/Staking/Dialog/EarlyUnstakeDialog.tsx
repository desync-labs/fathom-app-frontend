import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  Box,
  CircularProgress,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import React, { FC } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import { styled } from "@mui/material/styles";
import {
  InfoLabel,
  InfoValue,
  InfoWrapper,
} from "components/AppComponents/AppBox/AppBox";
import InfoIcon from "@mui/icons-material/Info";
import {
  ButtonPrimary,
} from "components/AppComponents/AppButton/AppButton";
import useEarlyUnstake from "hooks/useEarlyUnstake";
import { InfoMessageWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "../../../utils/format";


const DialogContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px 0 30px;
  
  > div {
    font-size: 18px;
    line-height: 22px;
  }
`;

const Amount = styled(Box)`
  font-weight: 600;
  font-size: 36px;
  line-height: 40px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 7px;

  span {
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
  }
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
`

const InfoLabelError = styled(InfoLabel)`
  color: #F76E6E;
`

const InfoValueError = styled(InfoValue)`
  color: #F76E6E;
`

type EarlyUnstakeDialogProps = {
  token: string;
  lockPosition: ILockPosition;
  onClose: () => void;
};

const EarlyUnstakeDialog: FC<EarlyUnstakeDialogProps> = ({
  onClose,
  token,
  lockPosition,
}) => {
  const {
    unstakeAmount,
    penaltyFee,
    unstakeAmountWithFee,
    isLoading,
    earlyUnstakeHandler,
  } = useEarlyUnstake(lockPosition);

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
        <UnstakeGrid container sx={{ '&.MuiGrid-container': { padding: '20px 0' } }}>
          <Grid item xs={12}>
            <WarningBlock>
              <InfoIcon sx={{ fontSize: "18px", color: '#F5953D' }} />
              <Typography component={'span'}>
                Penalty fee will be applied.
              </Typography>
            </WarningBlock>
          </Grid>
        </UnstakeGrid>
        <DialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box>You’re requesting to unstake</Box>
          <Amount>
            <Box>
              { formatNumber(unstakeAmount) }
            </Box>
            <span>
              { token }
            </span>
          </Amount>
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
              <InfoValue>{formatNumber(unstakeAmount)} { token }</InfoValue>
            </InfoWrapper>
            <InfoWrapper>
              <InfoLabelError>
                Penalty Fee
              </InfoLabelError>
              <InfoValueError>{ formatNumber(penaltyFee) } { token } (0.03%)</InfoValueError>
            </InfoWrapper>
            <InfoWrapper>
              <InfoLabel>
                Maximum Received
                <InfoIcon sx={{ fontSize: "18px", color: "#6379A1" }} />
              </InfoLabel>
              <InfoValue>{formatNumber(unstakeAmountWithFee)} { token }</InfoValue>
            </InfoWrapper>
          </Grid>
        </UnstakeGrid>
        <InfoMessageWrapper>
          <InfoIcon sx={{ fontSize: "18px", color: "#4F658C" }} />
          <Typography>
            By clicking “Unstake”, you’ll be signing 2 transactions in MetaMask to withdraw this amount to your connected wallet, and to unlock the position.
          </Typography>
        </InfoMessageWrapper>
        <UnstakeGrid container>
          <Grid item xs={12}>
            <ConfirmButton
              disabled={isLoading}
              isLoading={isLoading}
              onClick={earlyUnstakeHandler}
            >
              {isLoading ? <CircularProgress size={30} /> : "Confirm Early Unstake"}
            </ConfirmButton>
          </Grid>
        </UnstakeGrid>
      </DialogContent>
    </UnstakeDialogWrapper>
  );
};

export default EarlyUnstakeDialog;
