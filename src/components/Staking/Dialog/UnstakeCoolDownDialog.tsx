import { FC, memo } from "react";
import {
  AppDialog,
  DialogContentWrapper,
} from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { Box, DialogContent } from "@mui/material";
import { CancelButton } from "components/AppComponents/AppButton/AppButton";
import { ModalDescription } from "components/AppComponents/AppBox/AppBox";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";
import { ILockPosition } from "fathom-sdk";
import { ButtonsWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";

type UnstakeCoolDownDialogProps = {
  position: ILockPosition;
  token: string;
  onClose: () => void;
};

const UnstakeCoolDownDialog: FC<UnstakeCoolDownDialogProps> = ({
  token,
  onClose,
  position,
}) => {
  return (
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      color="primary"
      data-testid="dao-unstake-cooldown-dialog"
    >
      <AppDialogTitle
        id="customized-dialog-title"
        onClose={onClose}
        data-testid="dao-unstake-cooldown-dialog-title"
      >
        Unstake Cooling Down ...
      </AppDialogTitle>

      <DialogContent>
        <ModalDescription data-testid="dao-unstake-cooldown-dialog-description">
          You successfully requested to unstake. Now it's going to a “Cooldown"
          period for 2 days. After this period, you'll be able to Withdraw it at
          My Stats &gt; Ready-to-Withdraw. Learn more
        </ModalDescription>
        <DialogContentWrapper data-testid="dao-unstake-cooldown-dialog-cooling-down-content">
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>Cooling down ...</Box>
          <Box className={"amount"}>
            <Box>{formatPercentage(Number(position.amount) / 10 ** 18)}</Box>
            <span>{token}</span>
          </Box>
        </DialogContentWrapper>
        <ButtonsWrapper singleBtn>
          <CancelButton onClick={onClose}>Back to My Positions</CancelButton>
        </ButtonsWrapper>
      </DialogContent>
    </AppDialog>
  );
};

export default memo(UnstakeCoolDownDialog);
