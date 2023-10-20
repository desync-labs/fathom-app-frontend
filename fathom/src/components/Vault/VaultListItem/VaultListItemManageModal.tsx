import React, { FC } from "react";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  Box,
  DialogContent,
  Typography
} from "@mui/material";
import {
  AppDialog,
  DialogContentWrapper
} from "components/AppComponents/AppDialog/AppDialog";

import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import {
  ButtonPrimary,
  ButtonSecondary
} from "components/AppComponents/AppButton/AppButton";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  Approx,
  Apr,
  Token,
  Tokens
} from "components/Vault/VaultListItem/VaultListItemVaultInfo";

import plusWhiteSrc from "assets/svg/plus-white.svg";

const VaultManageGridDialogWrapper = styled(AppDialog)`
  .MuiPaper-root {
    maxwidth: 600px;
  }

  .MuiGrid-container {
    margin: 0 17px 15px 17px;
    padding: 10px 0 30px 0;
  }
`;

const ConfirmButton = styled(ButtonPrimary)`
  width: 100%;
  height: 48px;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
`;

const ButtonsWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 15px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: 15px 0;
  }

  button {
    width: 100%;
  }
`;

const ManagePair = styled("div")`
  color: #43FFF1;
  font-size: 17px;
  font-weight: 600;
  line-height: 24px;
`;

const ManageItem = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 100%;

  &.stats {
    margin-top: 10px;
    ${({ theme }) => theme.breakpoints.down("sm")} {
      display: block;
    }
  }
`;

const ManageLabel = styled("div")`
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.14px;
`;

const ManageValue = styled("div")`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.14px;
  gap: 10px;
`;

const ManageButtons = styled("div")`
  display: flex;
  justify-content: right;
  gap: 7px;
  width: 100%;
  margin-top: 10px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    button {
      width: 45%;
    }
  }
`;

const RemoveBtn = styled(ButtonSecondary)`
  border: 1px solid #6D86B2;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;

  &:hover {
    color: #fff;
    background: #3D5580;
    border: 1px solid #6D86B2;
  }
`;

const AddLiquidityBtn = styled(ButtonSecondary)`
  background: #3D5580;
  border: 1px solid transparent;
  color: #fff;
  font-weight: 600;

  &:hover {
    border: 1px solid #6D86B2;
    color: #fff;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 55% !important;
  }
`;

const VaultNotice = styled("div")`
  background: #3D5580;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  align-items: start;
  margin: 0 15px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: 0;
  }

  p {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.14px;
  }
`;

export type VaultManageProps = {
  onClose: () => void;
  onFinish: () => void;
  isMobile: boolean;
};

const VaultListItemManageModal: FC<VaultManageProps> = ({
  onClose,
  onFinish,
  isMobile
}) => {
  return (
    <VaultManageGridDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Manage Vault
      </AppDialogTitle>

      <DialogContent>
        <DialogContentWrapper>
          <ManagePair>USDT</ManagePair>
          <ManageItem>
            <ManageLabel>Your total pool tokens:</ManageLabel>
            <ManageValue>8.69507</ManageValue>
          </ManageItem>
          <ManageItem>
            <ManageLabel>Pooled USDT:</ManageLabel>
            <ManageValue>
              <Token>
                <img src={getTokenLogoURL("xUSDT")} width={20} height={20} alt={"token img"} />
                12.00
              </Token>
            </ManageValue>
          </ManageItem>
          <ManageItem>
            <ManageLabel>Your pool share:</ManageLabel>
            <ManageValue>29%</ManageValue>
          </ManageItem>
          <ManageItem className={"stats"}>
            <ManageLabel>
              <Apr>
                Apr
                <span>
                  9.40%
                </span>
              </Apr>
            </ManageLabel>
            <ManageValue>
              <Approx>
                ~295.95 USDs
              </Approx>
              <Tokens>
                <Token>
                  <img src={getTokenLogoURL("xUSDT")} width={20} height={20} alt={"token img"} />
                  12.00
                </Token>
                <Token>
                  <img src={getTokenLogoURL("WXDC")} width={20} height={20} alt={"token img"} />
                  12.00
                </Token>
              </Tokens>
            </ManageValue>
          </ManageItem>
          <ManageButtons>
            <RemoveBtn>Remove</RemoveBtn>
            <AddLiquidityBtn>
              <img src={plusWhiteSrc} alt={"plus"} width={20} height={20} />
              Add Liquidity
            </AddLiquidityBtn>
          </ManageButtons>
        </DialogContentWrapper>
        <ButtonsWrapper>
          <ConfirmButton>
            Unstake
          </ConfirmButton>
        </ButtonsWrapper>
        <VaultNotice>
          <InfoIcon sx={{ fontSize: "20px", color: "#B7C8E5", marginTop: "2px" }} />
          <Typography>
            Unstake will also automatically collect (withdraw) any earnings that you haven't got yet, and send them to
            your wallet.
          </Typography>
        </VaultNotice>
      </DialogContent>
    </VaultManageGridDialogWrapper>
  );
};

export default VaultListItemManageModal;
