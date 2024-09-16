import { FC, memo } from "react";
import { Box, DialogContent } from "@mui/material";
import { ILockPosition } from "fathom-sdk";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatPercentage } from "utils/format";

import { ButtonsWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";
import { BaseDialogTitle } from "components/Base/Dialog/BaseDialogTitle";
import { BaseCancelButton } from "components/Base/Buttons/StyledButtons";
import {
  BaseDialogContentWrapper,
  BaseDialogDescription,
  BaseDialogWrapperLight,
} from "components/Base/Dialog/StyledDialog";

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
    <BaseDialogWrapperLight
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      data-testid="dao-unstake-cooldown-dialog"
    >
      <BaseDialogTitle
        id="customized-dialog-title"
        onClose={onClose}
        data-testid="dao-unstake-cooldown-dialog-title"
      >
        Unstake Cooling Down ...
      </BaseDialogTitle>

      <DialogContent>
        <BaseDialogDescription data-testid="dao-unstake-cooldown-dialog-description">
          You successfully requested to unstake. Now it's going to a “Cooldown"
          period for 2 days. After this period, you'll be able to Withdraw it at
          My Stats &gt; Ready-to-Withdraw.
        </BaseDialogDescription>
        <BaseDialogContentWrapper data-testid="dao-unstake-cooldown-dialog-cooling-down-content">
          <img src={getTokenLogoURL(token)} alt={"token-logo"} width={58} />
          <Box sx={{ fontSize: "18px" }}>Cooling down ...</Box>
          <Box className={"amount"}>
            <Box>{formatPercentage(Number(position.amount) / 10 ** 18)}</Box>
            <span>{token}</span>
          </Box>
        </BaseDialogContentWrapper>
        <ButtonsWrapper singleBtn>
          <BaseCancelButton
            onClick={onClose}
            sx={{ color: "#fff", borderColor: "#6D86B2" }}
          >
            Back to My Positions
          </BaseCancelButton>
        </ButtonsWrapper>
      </DialogContent>
    </BaseDialogWrapperLight>
  );
};

export default memo(UnstakeCoolDownDialog);
