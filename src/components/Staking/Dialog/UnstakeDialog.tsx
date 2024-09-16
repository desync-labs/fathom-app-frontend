import { FC, memo } from "react";
import {
  Box,
  CircularProgress,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { ILockPosition } from "fathom-sdk";
import BigNumber from "bignumber.js";

import useSharedContext from "context/shared";
import usePricesContext from "context/prices";
import { getTokenLogoURL } from "utils/tokenLogo";
import useUnstake from "hooks/Staking/useUnstake";
import { formatNumber, formatPercentage } from "utils/format";

import { ButtonsWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";
import { BaseDialogTitle } from "components/Base/Dialog/BaseDialogTitle";
import {
  BaseButtonPrimary,
  BaseCancelButton,
} from "components/Base/Buttons/StyledButtons";
import {
  BaseInfoBox,
  InfoLabel,
  InfoValue,
  InfoWrapper,
} from "components/Base/Boxes/StyledBoxes";
import {
  BaseDialogContentWrapper,
  BaseDialogDescription,
  BaseDialogWrapperLight,
} from "components/Base/Dialog/StyledDialog";
import {
  BaseFormInputErrorWrapper,
  BaseFormInputLabel,
  BaseFormInputLogo,
  BaseFormInputUsdIndicator,
  BaseFormInputWrapper,
  BaseFormLabelRow,
  BaseFormSetMaxButton,
  BaseFormTextField,
  BaseFormWalletBalance,
} from "components/Base/Form/StyledForm";

const UnStakeGrid = styled(Grid)`
  width: auto;
  &.MuiGrid-container {
    margin: 20px 0;
    padding: 0;
  }
`;

const ConfirmButton = styled(BaseButtonPrimary)`
  width: 100%;
  height: 48px;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
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
  const { fthmPrice } = usePricesContext();

  return (
    <BaseDialogWrapperLight
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
    >
      <BaseDialogTitle id="customized-dialog-title" onClose={onClose}>
        Unstake
      </BaseDialogTitle>

      <DialogContent>
        <BaseDialogDescription>
          How much do you want to unstake from this position?
        </BaseDialogDescription>
        <BaseFormInputWrapper>
          <BaseFormLabelRow>
            <BaseFormInputLabel>Unstake amount</BaseFormInputLabel>
            <BaseFormWalletBalance>
              Available:{" "}
              {formatPercentage(
                BigNumber(totalBalance)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}{" "}
              {token}
            </BaseFormWalletBalance>
          </BaseFormLabelRow>
          <BaseFormTextField
            error={balanceError || requiredError}
            id="outlined-helperText"
            helperText={
              <>
                {balanceError && (
                  <BaseFormInputErrorWrapper>
                    <InfoIcon
                      sx={{
                        float: "left",
                        fontSize: "14px",
                      }}
                    />
                    <Box
                      sx={{ fontSize: "12px", paddingLeft: "6px" }}
                      component={"span"}
                    >
                      You do not have enough {token}
                    </Box>
                  </BaseFormInputErrorWrapper>
                )}
                {requiredError && (
                  <BaseFormInputErrorWrapper>
                    <InfoIcon
                      sx={{
                        float: "left",
                        fontSize: "14px",
                      }}
                    />
                    <Box
                      sx={{ fontSize: "12px", paddingLeft: "6px" }}
                      component={"span"}
                    >
                      Unstake amount is required
                    </Box>
                  </BaseFormInputErrorWrapper>
                )}
              </>
            }
            value={unStakeAmount}
            placeholder="0"
            onChange={handleUnStakeAmountChange}
          />
          <BaseFormInputUsdIndicator>{`$${formatNumber(
            BigNumber(unStakeAmount || 0)
              .multipliedBy(fthmPrice)
              .dividedBy(10 ** 18)
              .toNumber()
          )}`}</BaseFormInputUsdIndicator>
          <BaseFormInputLogo
            className={"extendedInput"}
            src={getTokenLogoURL(token)}
          />
          <BaseFormSetMaxButton onClick={() => setMax()}>
            Max
          </BaseFormSetMaxButton>
        </BaseFormInputWrapper>

        <BaseDialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>You’re requesting to unstake</Box>
          <Box className={"amount"}>
            <Box>
              {unStakeAmount ? formatPercentage(Number(unStakeAmount)) : "--"}
            </Box>
            <span>{token}</span>
          </Box>
        </BaseDialogContentWrapper>
        <UnStakeGrid container>
          <Grid item xs={12}>
            <InfoWrapper>
              <InfoLabel>You locked</InfoLabel>
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
              <InfoLabel>You'll received</InfoLabel>
              <InfoValue>
                {unStakeAmount ? formatNumber(Number(unStakeAmount)) : "--"}{" "}
                {token}
              </InfoValue>
            </InfoWrapper>
          </Grid>
        </UnStakeGrid>
        <ButtonsWrapper>
          {!isMobile && (
            <BaseCancelButton onClick={onClose}>Cancel</BaseCancelButton>
          )}
          <ConfirmButton
            disabled={isLoading}
            isLoading={isLoading}
            onClick={unStakeHandler}
          >
            {isLoading ? <CircularProgress size={30} /> : "Yes, Unstake"}
          </ConfirmButton>
          {isMobile && (
            <BaseCancelButton onClick={onClose}>Cancel</BaseCancelButton>
          )}
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

export default memo(UnStakeDialog);
