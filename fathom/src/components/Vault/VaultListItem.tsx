import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import {
  IconButton,
  TableCell,
  Box
} from "@mui/material";
import { getTokenLogoURL } from "utils/tokenLogo";
import { styled } from "@mui/material/styles";

import useVaultListItem from "hooks/useVaultListItem";

import { VaultNowBtn } from "components/AppComponents/AppButton/AppButton";

import VaultListItemPairInfo from "components/Vault/VaultListItem/VaultListItemPairInfo";
import VaultListItemVaultInfo from "components/Vault/VaultListItem/VaultListItemVaultInfo";

import VaultListItemEarningDetails from "components/Vault/VaultListItem/VaultListItemEarningDetails";
import VaultListItemEarned from "components/Vault/VaultListItem/VaultListItemEarned";
import VaultListItemManageModal from "components/Vault/VaultListItem/VaultListItemManageModal";

import LockSrc from "assets/svg/lock.svg";
import LockAquaSrc from "assets/svg/lock-aqua.svg";
import DirectionDown from "assets/svg/direction-down.svg";
import DirectionUp from "assets/svg/direction-up.svg";
import lockAquaSrc from "assets/svg/lock-aqua.svg";

const VaultListItemPoolCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const VaultListItemImageWrapper = styled("div")`
  display: flex;
  justify-content: left;

  img {
    border-radius: 18px;
    width: 36px;
    height: 36px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    img {
      width: 24px;
      height: 24px;
      margin-top: 0;
    }
  }
`;

export const VaultInfo = styled("div")``;

export const VaultTitle = styled("div")`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const VaultPercent = styled("div")`
  display: flex;
  padding: 4px 8px;
  color: #fff;
  font-size: 12px;
  border-radius: 6px;
  width: 32px;
  height: 20px;
  background: #3665FF;
  align-items: center;
  font-weight: bold;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 46px;
  }
`;

export const VaultEarned = styled("div")`
  line-height: 20px;
  font-size: 14px;
  color: #fff;
`;

export const VaultApr = styled("div")`
  color: #fff;
`;

export const VaultStackedLiquidity = styled("div")`
  color: #fff;
`;

export const VaultAvailable = styled("div")`
  &.blue {
    color: #6D86B2;
  }

  color: #fff;
`;

export const VaultStacked = styled("div")`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #6D86B2;
  gap: 12px;

  .img-wrapper {
    background: #4F658C33;
    border-radius: 8px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .value {
    color: #fff;  
  }
`;

export const ExtendedBtn = styled(IconButton)`
  float: right;

  &:hover {
    background: none;
  }

  &.visible {
    display: flex;
  }

  &.hidden {
    display: none;
  }
`;

export const VaultItemInfoWrapper = styled("div")`
  background: #132340;
  border-radius: 8px;
  padding: 20px 32px;
  margin-bottom: 5px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 20px;
    margin: 16px 0;

    &.mb-0 {
      margin-bottom: 0;
    }

    &.mt-3 {
      margin-top: 3px;
    }
  }
`;

export const EarningLabel = styled("div")`
  background: rgba(0, 128, 118, 0.15);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #43FFF1;
  border-radius: 6px;
  height: 20px;
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-left: 19px;
  }
`;

const VaultListItem = () => {
  const {
    isMobile,
    extended,
    manageVault,
    setExtended,
    setManageVault
  } = useVaultListItem();

  return (
    <>
      <AppTableRow className={!extended ? "border single" : undefined}>
        <VaultListItemPoolCell>
          <VaultListItemImageWrapper>
            <img src={getTokenLogoURL("xUSDT")} alt={"xUSDT"} />
          </VaultListItemImageWrapper>
          <VaultInfo>
            <EarningLabel>Earning</EarningLabel>
            <VaultTitle>
              USDT
            </VaultTitle>
          </VaultInfo>
        </VaultListItemPoolCell>
        <TableCell>
          <VaultPercent>1%</VaultPercent>
        </TableCell>
        <TableCell>
          <VaultEarned>0</VaultEarned>
        </TableCell>
        <TableCell>
          <VaultApr>100%</VaultApr>
        </TableCell>
        <TableCell>
          <VaultStackedLiquidity>
            $103,048
          </VaultStackedLiquidity>
        </TableCell>
        <TableCell>
          <VaultAvailable className={"blue"}>
            0
            {/*<VaultNowBtn>*/}
            {/*  <img src={lockAquaSrc} alt={"Aqua"} />*/}
            {/*  Vault Now*/}
            {/*</VaultNowBtn>*/}
          </VaultAvailable>
        </TableCell>
        <TableCell>
          <VaultStacked>
            <Box className={"img-wrapper"}>
              {/*<img src={LockSrc} alt={"locked"} width={20} height={20} />*/}
              <img src={LockAquaSrc} alt={"locked-active"} width={20} height={20} />
            </Box>
            <Box className={"value"}>0 USDT</Box>
          </VaultStacked>
        </TableCell>
        <TableCell>
          <ExtendedBtn className={extended ? "visible" : "hidden"} onClick={() => setExtended(!extended)}>
            <img src={DirectionUp} alt={"direction-up"} />
          </ExtendedBtn>
          <ExtendedBtn className={!extended ? "visible" : "hidden"} onClick={() => setExtended(!extended)}>
            <img src={DirectionDown} alt={"direction-down"} />
          </ExtendedBtn>
        </TableCell>
      </AppTableRow>
      {extended && <AppTableRow className={"border"}>
        <TableCell colSpan={8} sx={{ paddingBottom: "15px !important" }}>
          <VaultItemInfoWrapper>
            {/*<VaultListItemPairInfo />*/}
            <VaultListItemVaultInfo isMobile={isMobile} />
            {/*<VaultListItemEarningDetails isMobile={isMobile} onOpen={() => setManageVault(true)} />*/}
          </VaultItemInfoWrapper>
          {/*<VaultItemInfoWrapper>*/}
          {/*  <VaultListItemEarned isMobile={isMobile} />*/}
          {/*</VaultItemInfoWrapper>*/}
        </TableCell>
      </AppTableRow>}
      {manageVault && <VaultListItemManageModal
        isMobile={isMobile}
        onClose={() => setManageVault(false)}
        onFinish={() => {}}
      />}
    </>
  );
};

export default VaultListItem;