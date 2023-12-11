import { FC } from "react";
import {
  AppDialog,
  DialogContentWrapper,
} from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { Box, DialogContent, Typography } from "@mui/material";
import { CancelButton } from "components/AppComponents/AppButton/AppButton";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";
import { ILockPosition } from "fathom-sdk";

export const InfoMessageWrapper = styled(Box)`
  display: flex;
  align-items: start;
  gap: 5px;
  padding: 0 12px;
  p {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #9fadc6;
    margin-bottom: 20px;
  }

  svg {
    margin-top: 2px;
  }
`;

const Description = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  padding: 0 15px;
`;

const ButtonsWrapper = styled(Box)`
  width: auto;
  margin: 20px 15px;
  display: flex;
  gap: 6px;
  align-items: center;

  > button {
    width: 100%;
    height: 48px;
  }
`;

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
      maxWidth="md"
      color="primary"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Unstake Cooling Down ...
      </AppDialogTitle>

      <DialogContent>
        <Description>
          You successfully requested to unstake. Now it's going to a “Cooldown"
          period for 2 days. After this period, you'll be able to Withdraw it at
          My Stats &gt; Ready-to-Withdraw. Learn more
        </Description>
        <DialogContentWrapper>
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>Cooling down ...</Box>
          <Box className={"amount"}>
            <Box>{formatNumber(Number(position.amount) / 10 ** 18)}</Box>
            <span>{token}</span>
          </Box>
        </DialogContentWrapper>
        <ButtonsWrapper>
          <CancelButton onClick={onClose}>Back to My Positions</CancelButton>
        </ButtonsWrapper>
      </DialogContent>
    </AppDialog>
  );
};

export default UnstakeCoolDownDialog;
