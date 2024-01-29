import { FC, memo, useMemo } from "react";
import { IconButton, TableCell, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import BigNumber from "bignumber.js";
import { IVault, IVaultPosition } from "fathom-sdk";

import usePricesContext from "context/prices";
import useConnector from "context/connector";
import useVaultListItem, { VaultInfoTabs } from "hooks/useVaultListItem";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency, formatNumber, formatPercentage } from "utils/format";

import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import VaultListItemManageModal from "components/Vault/VaultListItem/VaultListItemManageModal";
import VaultListItemDepositModal from "components/Vault/VaultListItem/VaultListItemDepositModal";
import VaultListItemNav from "components/Vault/VaultListItem/VaultListItemNav";
import VaultItemPositionInfo from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultItemPositionInfo";
import VaultItemAbout from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultItemAbout";
import VaultItemStrategies from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultItemStrategies";
import WalletConnectBtn from "components/Common/WalletConnectBtn";

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
  justify-content: center;
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
  vaultPosition: IVaultPosition | null | undefined;
  protocolFee: number;
  performanceFee: number;
};

const VaultListItem: FC<VaultListItemPropsType> = ({
  vaultItemData,
  vaultPosition,
  protocolFee,
  performanceFee,
}) => {
  const { token, balanceTokens, depositLimit, apr } = vaultItemData;
  const { fxdPrice } = usePricesContext();
  const vaultTestId = vaultItemData.id;

  const {
    extended,
    manageVault,
    newVaultDeposit,
    activeVaultInfoTab,
    setActiveVaultInfoTab,
    setExtended,
    setManageVault,
    setNewVaultDeposit,
  } = useVaultListItem({ vaultPosition });
  const { account } = useConnector();

  return (
    <>
      <AppTableRow
        className={!extended || !vaultPosition ? "border single" : undefined}
        data-testid={`vaultRow-${vaultTestId}`}
      >
        <TableCell colSpan={2}>
          <FlexBox>
            <VaultListItemImageWrapper>
              <img
                src={getTokenLogoURL(token.symbol)}
                alt={token.name}
                data-testid={`vaultRow-${vaultTestId}-tokenImg`}
              />
            </VaultListItemImageWrapper>
            <VaultInfo>
              {vaultPosition?.balancePosition &&
                BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) && (
                  <EarningLabel>Earning</EarningLabel>
                )}
              <VaultTitle data-testid={`vaultRow-${vaultTestId}-tokenTitle`}>
                {token.name}
              </VaultTitle>
            </VaultInfo>
          </FlexBox>
        </TableCell>
        <TableCell
          colSpan={1}
          data-testid={`vaultRow-${vaultTestId}-feeValueCell`}
        >
          <VaultPercent>
            {formatNumber(BigNumber(performanceFee).toNumber())}%
          </VaultPercent>
        </TableCell>
        <TableCell
          colSpan={1}
          data-testid={`vaultRow-${vaultTestId}-earnedValueCell`}
        >
          <VaultEarned>
            {vaultPosition?.balanceProfit &&
            BigNumber(vaultPosition?.balanceProfit).isGreaterThan(0)
              ? "$" +
                formatPercentage(
                  BigNumber(vaultPosition.balanceProfit)
                    .multipliedBy(fxdPrice)
                    .dividedBy(10 ** 36)
                    .toNumber()
                )
              : "0"}
          </VaultEarned>
        </TableCell>
        <TableCell
          colSpan={1}
          data-testid={`vaultRow-${vaultTestId}-aprValueCell`}
        >
          <VaultApr>{formatNumber(BigNumber(apr).toNumber())}%</VaultApr>
        </TableCell>
        <TableCell
          colSpan={1}
          data-testid={`vaultRow-${vaultTestId}-tvlValueCell`}
        >
          <VaultStackedLiquidity>
            {formatCurrency(
              BigNumber(fxdPrice)
                .dividedBy(10 ** 18)
                .multipliedBy(BigNumber(balanceTokens).dividedBy(10 ** 18))
                .toNumber()
            )}
          </VaultStackedLiquidity>
        </TableCell>
        <TableCell
          colSpan={1}
          data-testid={`vaultRow-${vaultTestId}-availableValueCell`}
        >
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
        <TableCell
          colSpan={1}
          data-testid={`vaultRow-${vaultTestId}-stakedValueCell`}
        >
          <VaultStacked>
            <Box className={"img-wrapper"}>
              {vaultPosition?.balancePosition &&
              BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) ? (
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
                ? formatNumber(
                    BigNumber(vaultPosition.balancePosition)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )
                : 0}
              {" " + token.symbol}
            </Box>
          </VaultStacked>
        </TableCell>
        <TableCell colSpan={2}>
          <FlexBox justifyContent={"space-evenly"}>
            {(!vaultPosition ||
              !BigNumber(vaultPosition.balanceShares).isGreaterThan(0)) &&
              account && (
                <ButtonPrimary
                  onClick={() => setNewVaultDeposit(true)}
                  data-testid={`vaultRow-${vaultTestId}-depositButton`}
                >
                  Deposit
                </ButtonPrimary>
              )}{" "}
            {!account && (
              <WalletConnectBtn
                testId={`vaultRow-${vaultTestId}-connectWalletButton`}
              />
            )}
            <ExtendedBtn
              className={extended ? "visible" : "hidden"}
              onClick={() => setExtended(!extended)}
              data-testid={`vaultRow-${vaultTestId}-hideButton`}
            >
              <img src={DirectionUp} alt={"direction-up"} />
            </ExtendedBtn>
            <ExtendedBtn
              className={!extended ? "visible" : "hidden"}
              onClick={() => setExtended(!extended)}
              data-testid={`vaultRow-${vaultTestId}-extendButton`}
            >
              <img src={DirectionDown} alt={"direction-down"} />
            </ExtendedBtn>
          </FlexBox>
        </TableCell>
      </AppTableRow>
      {extended && (
        <AppTableRow
          className={"border"}
          data-testid={`vaultRowDetails-${vaultTestId}`}
        >
          <TableCell
            colSpan={10}
            sx={{ width: "100%", padding: "0 !important" }}
          >
            <VaultListItemNav
              vaultPosition={vaultPosition}
              activeVaultInfoTab={activeVaultInfoTab}
              setActiveVaultInfoTab={setActiveVaultInfoTab}
            />
            <Box sx={{ padding: "20px" }}>
              {vaultPosition &&
                BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
                activeVaultInfoTab === VaultInfoTabs.POSITION && (
                  <VaultItemPositionInfo
                    vaultItemData={vaultItemData}
                    vaultPosition={vaultPosition}
                    setManageVault={setManageVault}
                  />
                )}
              {activeVaultInfoTab === VaultInfoTabs.ABOUT && (
                <VaultItemAbout
                  vaultItemData={vaultItemData}
                  protocolFee={protocolFee}
                  performanceFee={performanceFee}
                />
              )}
              {activeVaultInfoTab === VaultInfoTabs.STRATEGIES && (
                <VaultItemStrategies
                  vaultItemData={vaultItemData}
                  performanceFee={performanceFee}
                />
              )}
            </Box>
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
              performanceFee={performanceFee}
              onClose={() => setManageVault(false)}
            />
          )
        );
      }, [manageVault, setManageVault])}
      {useMemo(() => {
        return (
          newVaultDeposit && (
            <VaultListItemDepositModal
              vaultItemData={vaultItemData}
              performanceFee={performanceFee}
              onClose={() => setNewVaultDeposit(false)}
            />
          )
        );
      }, [newVaultDeposit, setNewVaultDeposit])}
    </>
  );
};

export default memo(VaultListItem);
