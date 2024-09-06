import { FC, memo, useMemo } from "react";
import { Box, CircularProgress, DialogContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";
import useStakingContext from "context/staking";
import useSharedContext from "context/shared";
import { ButtonsWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";
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

const ConfirmButton = styled(BaseButtonPrimary)`
  font-size: 17px;
`;

type WithdrawDialogProps = {
  token: string;
  onClose: () => void;
};

const WithdrawDialog: FC<WithdrawDialogProps> = ({ token, onClose }) => {
  const { withdrawAll, stake, action } = useStakingContext();
  const { isMobile } = useSharedContext();

  const isLoading = useMemo(() => {
    return action?.type === "withdrawAll";
  }, [action]);

  return (
    <BaseDialogWrapperLight
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
    >
      <BaseDialogTitle id="customized-dialog-title" onClose={onClose}>
        Withdraw
      </BaseDialogTitle>

      <DialogContent>
        <BaseDialogDescription>
          Once it's completed, you'll see this amount in your wallet balance...
        </BaseDialogDescription>
        <BaseDialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>You're withdrawing...</Box>
          <Box className={"amount"}>
            <Box>{formatPercentage(stake.claimedAmount / 10 ** 18)}</Box>
            <span>{token}</span>
          </Box>
        </BaseDialogContentWrapper>
        <ButtonsWrapper>
          {!isMobile && (
            <BaseCancelButton onClick={onClose}>Cancel</BaseCancelButton>
          )}
          <ConfirmButton
            disabled={isLoading}
            isLoading={isLoading}
            onClick={() => withdrawAll(onClose)}
          >
            {isLoading ? <CircularProgress size={30} /> : "Confirm Withdraw"}
          </ConfirmButton>
          {isMobile && (
            <BaseCancelButton onClick={onClose}>Cancel</BaseCancelButton>
          )}
        </ButtonsWrapper>
      </DialogContent>
    </BaseDialogWrapperLight>
  );
};

export default memo(WithdrawDialog);
