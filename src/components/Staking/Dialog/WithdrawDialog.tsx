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
} from "components/AppComponents/AppButton/AppButton";
import { ModalDescription } from "components/AppComponents/AppBox/AppBox";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";
import useStakingContext from "context/staking";
import useSharedContext from "context/shared";
import {
  ButtonsWrapper,
  InfoMessageWrapper,
} from "components/Staking/Dialog/ClaimRewardsDialog";
import InfoIcon from "@mui/icons-material/Info";

const ConfirmButton = styled(ButtonPrimary)`
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
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      color="primary"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Withdraw
      </AppDialogTitle>

      <DialogContent>
        <ModalDescription>
          Once it's completed, you'll see this amount in your wallet balance...
        </ModalDescription>
        <DialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>You're withdrawing...</Box>
          <Box className={"amount"}>
            <Box>{formatPercentage(stake.claimedAmount / 10 ** 18)}</Box>
            <span>{token}</span>
          </Box>
        </DialogContentWrapper>
        <ButtonsWrapper>
          {!isMobile && <CancelButton onClick={onClose}>Cancel</CancelButton>}
          <ConfirmButton
            disabled={isLoading}
            isLoading={isLoading}
            onClick={() => withdrawAll(onClose)}
          >
            {isLoading ? <CircularProgress size={30} /> : "Confirm Withdraw"}
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

export default memo(WithdrawDialog);
