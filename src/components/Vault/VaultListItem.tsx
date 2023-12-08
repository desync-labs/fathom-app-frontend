import { FC, useMemo } from "react";
import { IconButton, TableCell, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import BigNumber from "bignumber.js";

import usePricesContext from "context/prices";
import useVaultListItem from "hooks/useVaultListItem";
import { IVaultPosition, IVault } from "hooks/useVaultList";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency, formatNumber, formatPercentage } from "utils/format";

import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import VaultListItemEarningDetails from "components/Vault/VaultListItem/VaultListItemEarningDetails";
import VaultListItemEarned from "components/Vault/VaultListItem/VaultListItemEarned";
import VaultListItemManageModal from "components/Vault/VaultListItem/VaultListItemManageModal";
import VaultListItemDepositModal from "components/Vault/VaultListItem/VaultListItemDepositModal";

import LockSrc from "assets/svg/lock.svg";
import LockAquaSrc from "assets/svg/lock-aqua.svg";
import DirectionDown from "assets/svg/direction-down.svg";
import DirectionUp from "assets/svg/direction-up.svg";

const FlexBox = styled(Box)`
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
  width: fit-content;
  height: 20px;
  background: #3665ff;
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
    color: #6d86b2;
  }

  color: #fff;
`;

export const VaultStacked = styled("div")`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #6d86b2;
  gap: 12px;

  .img-wrapper {
    background: #4f658c33;
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
  color: #43fff1;
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

export type VaultListItemPropsType = {
  vaultItemData: IVault;
  vaultPosition?: IVaultPosition | null | undefined;
};

const VaultListItem: FC<VaultListItemPropsType> = ({
  vaultItemData,
  vaultPosition,
}) => {
  const { token, balanceTokens, depositLimit, strategies } = vaultItemData;
  const { fxdPrice } = usePricesContext();

  const {
    isMobile,
    extended,
    manageVault,
    newVaultDeposit,
    setExtended,
    setManageVault,
    setNewVaultDeposit,
  } = useVaultListItem();

  return (
    <>
      <AppTableRow
        className={!extended || !vaultPosition ? "border single" : undefined}
      >
        <TableCell>
          <FlexBox>
            <VaultListItemImageWrapper>
              <img src={getTokenLogoURL(token.symbol)} alt={token.name} />
            </VaultListItemImageWrapper>
            <VaultInfo>
              {vaultPosition?.balancePosition && (
                <EarningLabel>Earning</EarningLabel>
              )}
              <VaultTitle>{token.name}</VaultTitle>
            </VaultInfo>
          </FlexBox>
        </TableCell>
        <TableCell>
          <VaultPercent>{strategies[0].reports[0].totalFees}%</VaultPercent>
        </TableCell>
        <TableCell>
          <VaultEarned>
            {formatPercentage(
              BigNumber(vaultPosition?.balanceProfit || "0")
                .dividedBy(10 ** 18)
                .toNumber()
            )}
          </VaultEarned>
        </TableCell>
        <TableCell>
          <VaultApr>
            {formatNumber(
              BigNumber(strategies[0].reports[0].results[0].apr).toNumber()
            )}
            %
          </VaultApr>
        </TableCell>
        <TableCell>
          <VaultStackedLiquidity>
            {formatCurrency(
              BigNumber(fxdPrice)
                .dividedBy(10 ** 18)
                .multipliedBy(BigNumber(balanceTokens).dividedBy(10 ** 18))
                .toNumber()
            )}
          </VaultStackedLiquidity>
        </TableCell>
        <TableCell>
          <VaultAvailable className={"blue"}>
            {formatNumber(
              BigNumber(depositLimit)
                .minus(BigNumber(balanceTokens))
                .dividedBy(10 ** 18)
                .toNumber()
            )}{" "}
            {token.symbol}
          </VaultAvailable>
        </TableCell>
        <TableCell>
          <VaultStacked>
            <Box className={"img-wrapper"}>
              {vaultPosition ? (
                <img
                  src={LockAquaSrc}
                  alt={"locked-active"}
                  width={20}
                  height={20}
                />
              ) : (
                <img src={LockSrc} alt={"locked"} width={20} height={20} />
              )}
            </Box>
            <Box className={"value"}>
              {vaultPosition
                ? BigNumber(vaultPosition.balancePosition)
                    .dividedBy(10 ** 18)
                    .toFormat(0)
                : 0}
              {" " + token.symbol}
            </Box>
          </VaultStacked>
        </TableCell>
        {vaultPosition ? (
          <TableCell>
            <ExtendedBtn
              className={extended ? "visible" : "hidden"}
              onClick={() => setExtended(!extended)}
            >
              <img src={DirectionUp} alt={"direction-up"} />
            </ExtendedBtn>
            <ExtendedBtn
              className={!extended ? "visible" : "hidden"}
              onClick={() => setExtended(!extended)}
            >
              <img src={DirectionDown} alt={"direction-down"} />
            </ExtendedBtn>
          </TableCell>
        ) : (
          <TableCell>
            <ButtonPrimary onClick={() => setNewVaultDeposit(true)}>
              Deposit
            </ButtonPrimary>
          </TableCell>
        )}
      </AppTableRow>
      {vaultPosition && extended && (
        <AppTableRow className={"border"}>
          <TableCell colSpan={8} sx={{ padding: "20px !important" }}>
            <VaultItemInfoWrapper>
              <VaultListItemEarningDetails
                vaultItemData={vaultItemData}
                vaultPosition={vaultPosition}
                isMobile={isMobile}
                onOpen={() => setManageVault(true)}
              />
            </VaultItemInfoWrapper>
            <VaultItemInfoWrapper>
              <VaultListItemEarned
                isMobile={isMobile}
                vaultItemData={vaultItemData}
                vaultPosition={vaultPosition}
              />
            </VaultItemInfoWrapper>
          </TableCell>
        </AppTableRow>
      )}
      {useMemo(() => {
        return (
          manageVault &&
          vaultPosition && (
            <VaultListItemManageModal
              vaultItemData={vaultItemData}
              vaultPosition={vaultPosition}
              isMobile={isMobile}
              onClose={() => setManageVault(false)}
            />
          )
        );
      }, [manageVault, setManageVault])}
      {useMemo(() => {
        return (
          newVaultDeposit && (
            <VaultListItemDepositModal
              isMobile={isMobile}
              vaultItemData={vaultItemData}
              onClose={() => setNewVaultDeposit(false)}
            />
          )
        );
      }, [newVaultDeposit, setNewVaultDeposit])}
    </>
  );
};

export default VaultListItem;
