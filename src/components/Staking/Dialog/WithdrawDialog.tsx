import { FC, useMemo } from "react";
import {
  AppDialog,
  DialogContentWrapper,
} from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { Box, CircularProgress, DialogContent } from "@mui/material";
import {
  ButtonPrimary,
  CancelButton,
} from "components/AppComponents/AppButton/AppButton";
import { ModalDescription } from "components/AppComponents/AppBox/AppBox";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";
import useStakingContext from "context/staking";

const ConfirmButton = styled(ButtonPrimary)`
  font-size: 17px;
`;

const ButtonsWrapper = styled(Box)`
  width: auto;
  margin: 20px 15px;
  display: flex;
  gap: 6px;
  align-items: center;
  > button {
    width: calc(50% - 3px);
    height: 48px;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    button {
      width: 100%;
    }
  }
`;

type WithdrawDialogProps = {
  token: string;
  onClose: () => void;
};

const WithdrawDialog: FC<WithdrawDialogProps> = ({ token, onClose }) => {
  const { withdrawAll, stake, action, isMobile } = useStakingContext();

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
            <Box>{formatNumber(stake.claimedAmount / 10 ** 18)}</Box>
            <span>{token}</span>
          </Box>
        </DialogContentWrapper>
        <ButtonsWrapper>
          {!isMobile && <CancelButton onClick={onClose}>Cancel</CancelButton>}
          <ConfirmButton onClick={() => withdrawAll(onClose)}>
            {isLoading ? <CircularProgress size={30} /> : "Confirm Withdraw"}
          </ConfirmButton>
          {isMobile && <CancelButton onClick={onClose}>Cancel</CancelButton>}
        </ButtonsWrapper>
      </DialogContent>
    </AppDialog>
  );
};

export default WithdrawDialog;
