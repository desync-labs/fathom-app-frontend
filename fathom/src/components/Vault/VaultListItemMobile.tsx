import React, { FC } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import {
  ListItemWrapper,
  ListLabel,
  ListValue
} from "components/AppComponents/AppList/AppList";

import {
  ExtendedBtn,
  VaultInfo,
  EarningLabel,
  VaultItemInfoWrapper,
  VaultListItemImageWrapper,
  VaultPercent,
  VaultStacked,
  VaultTitle,
  VaultListItemPropsType
} from "components/Vault/VaultListItem";
import VaultListItemPairInfo from "components/Vault/VaultListItem/VaultListItemPairInfo";
import VaultListItemVaultInfo from "components/Vault/VaultListItem/VaultListItemVaultInfo";
import VaultListItemEarningDetails from "components/Vault/VaultListItem/VaultListItemEarningDetails";
import VaultListItemEarned from "components/Vault/VaultListItem/VaultListItemEarned";
import VaultListItemManageModal from "components/Vault/VaultListItem/VaultListItemManageModal";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";
import VaultListItemDepositModal from "components/Vault/VaultListItem/VaultListItemDepositModal";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";

import { getTokenLogoURL } from "utils/tokenLogo";
import useVaultListItem from "hooks/useVaultListItem";

import DirectionUp from "assets/svg/direction-up.svg";
import DirectionDown from "assets/svg/direction-down.svg";
import LockSrc from "assets/svg/lock.svg";
import LockAquaSrc from "assets/svg/lock-aqua.svg";


const VaultPoolName = styled("div")`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
`;

const VaultListItemMobileContainer = styled(Box)`
  width: 100%;
  background: #131f35;
  border-bottom: 1px solid #131f35;
  border-radius: 8px;
  padding: 20px 16px;
  margin-bottom: 5px;
`;

export const VaultListValue = styled(ListValue)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7px;

  &.neutral {
    font-size: 14px;
    color: #6D86B2;
    line-height: 20px;
    font-weight: 600;
  }
`;

export const VaultListLabel = styled(ListLabel)`
  color: #6D86B2;
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  display: flex;
  align-items: center;
  gap: 7px;
`;

const ExtendedBtnWrapper = styled("div")`
  height: 36px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

type VaultListItemMobileAdditionalDataProps = {
  hasDeposite: boolean | undefined
}

export const VaultListItemMobileAdditionalData = ({ hasDeposite }: VaultListItemMobileAdditionalDataProps) => {
  return (
    <>
      <ListItemWrapper>
        <VaultListLabel>
          TVL
          <AppPopover id={"tvl"}
            text={<>
              Tvl Test Text
            </>} />
        </VaultListLabel>
        <VaultListValue>
          $494.498
        </VaultListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <VaultListLabel>Available</VaultListLabel>
        <VaultListValue className={"neutral"}>
          0
        </VaultListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <VaultListLabel>
          Locked
        </VaultListLabel>
        <VaultListValue className={"neutral"}>
          <VaultStacked>
            <div className={"img-wrapper"}>
              {hasDeposite
                ? <img src={LockAquaSrc} alt={"locked"} width={20} height={20} />
                : <img src={LockSrc} alt={"locked"} width={20} height={20} />
              }
            </div>
            0
          </VaultStacked>
        </VaultListValue>
      </ListItemWrapper>
    </>
  );
};


const VaultListItemMobile: FC<VaultListItemPropsType> = ({ hasDeposite }) => {
  const {
    manageVault,
    newVaultDeposit,
    extended,
    isMobile,
    setNewVaultDeposit,
    setExtended,
    setManageVault,
  } = useVaultListItem();

  return (
    <VaultListItemMobileContainer>
      <EarningLabel>Earning</EarningLabel>
      <VaultPoolName>
        <VaultListItemImageWrapper>
          <img src={getTokenLogoURL("xUSDT")} alt={"xUSDT"} />
        </VaultListItemImageWrapper>
        <VaultInfo>
          <VaultTitle>
            USDT
          </VaultTitle>
        </VaultInfo>
      </VaultPoolName>
      <ListItemWrapper>
        <VaultListLabel>
          Fee
          <AppPopover id={"fee"}
            text={<>
              Fee Test Text
            </>} />
        </VaultListLabel>
        <VaultListValue>
          <VaultPercent>2.4%</VaultPercent>
        </VaultListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <VaultListLabel>
          Earned
          <AppPopover id={"earned"}
            text={<>
              Earned Test Text
            </>} />
        </VaultListLabel>
        <VaultListValue>0</VaultListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <VaultListLabel>
          Apr
          <AppPopover id={"apr"}
            text={<>
              Apr Test Text
            </>} />
        </VaultListLabel>
        <VaultListValue>
          20%
        </VaultListValue>
      </ListItemWrapper>
      {/*{ extended && <VaultItemInfoWrapper>*/}
      {/*  <VaultListItemVaultInfo isMobile={isMobile} />*/}
      {/*</VaultItemInfoWrapper> }*/}

      {
        (extended && hasDeposite) && <>
          <VaultItemInfoWrapper className={"mb-0"}>
            <VaultListItemEarned isMobile={isMobile} />
          </VaultItemInfoWrapper>

          <VaultItemInfoWrapper className={"mt-3"}>
            <VaultListItemEarningDetails isMobile={isMobile} onOpen={() => setManageVault(true)} />
          </VaultItemInfoWrapper>
        </>
      }

      <VaultListItemMobileAdditionalData hasDeposite={hasDeposite} />
      {hasDeposite
        ? <ExtendedBtnWrapper>
          <ExtendedBtn className={extended ? "visible" : "hidden"} onClick={() => setExtended(!extended)}>
            <img src={DirectionUp} alt={"direction-up"} />
          </ExtendedBtn>
          <ExtendedBtn className={!extended ? "visible" : "hidden"} onClick={() => setExtended(!extended)}>
            <img src={DirectionDown} alt={"direction-down"} />
          </ExtendedBtn>
        </ExtendedBtnWrapper>
        : <ButtonPrimary onClick={() => setNewVaultDeposit(true)} sx={{ width: '100%' }}>
          Deposit
        </ButtonPrimary>
      }
      {manageVault && <VaultListItemManageModal
        isMobile={isMobile}
        onClose={() => setManageVault(false)}
        onFinish={() => { }}
      />}
      {newVaultDeposit && <VaultListItemDepositModal
        isMobile={isMobile}
        onClose={() => setNewVaultDeposit(false)}
        onFinish={() => { }}
      />}
    </VaultListItemMobileContainer>
  );
};

export default VaultListItemMobile;