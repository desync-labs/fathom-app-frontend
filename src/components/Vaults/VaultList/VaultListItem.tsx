import { FC, memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Box, CircularProgress, TableCell } from "@mui/material";
import { IVault, IVaultPosition } from "fathom-sdk";
import BigNumber from "bignumber.js";
import { useApr } from "hooks/Vaults/useApr";
import usePricesContext from "context/prices";
import useVaultListItem from "hooks/Vaults/useVaultListItem";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency, formatNumber } from "utils/format";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import VaultListItemDepositModal from "components/Vaults/VaultList/VaultListItemDepositModal";
import VaultListItemManageModal from "components/Vaults/VaultList/VaultListItemManageModal";

import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import LockAquaSrc from "assets/svg/lock-aqua.svg";
import LockSrc from "assets/svg/lock.svg";
import { BaseTableItemRow } from "../../Base/Table/StyledTable";

export const VaultTitle = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-decoration-line: underline;
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
  word-break: break-word;
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

export const VaultTagLabel = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: fit-content;
  background: rgba(79, 101, 140, 0.3);
  font-size: 13px;
  font-weight: 600;
  color: #43fff1;
  border-radius: 6px;
  margin-bottom: 4px;
  padding: 4px 8px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-left: 19px;
  }
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

type VaultListItemProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition | null;
  performanceFee: number;
};

const VaultListItem: FC<VaultListItemProps> = ({
  vaultItemData,
  vaultPosition,
  performanceFee,
}) => {
  const { token, balanceTokens, depositLimit, shutdown } = vaultItemData;
  const formattedApr = useApr(vaultItemData);
  const { fxdPrice } = usePricesContext();
  const navigate = useNavigate();
  const vaultTestId = vaultItemData.id;

  const {
    balanceEarned,
    manageVault,
    newVaultDeposit,
    setManageVault,
    setNewVaultDeposit,
    isTfVaultType,
    isUserKycPassed,
    tfVaultDepositEndDate,
    tfVaultLockEndDate,
    activeTfPeriod,
    tfVaultDepositLimit,
    handleWithdrawAll,
    minimumDeposit,
    isWithdrawLoading,
    showWithdrawAllButton,
  } = useVaultListItem({ vaultPosition, vault: vaultItemData });

  const redirectToVaultDetail = useCallback(() => {
    navigate(`/vaults/${vaultItemData.id}`);
  }, [vaultItemData.id]);

  return (
    <>
      <BaseTableItemRow data-testid={`vaultRow-${vaultTestId}`}>
        <TableCell
          colSpan={2}
          sx={{ width: "20%", cursor: "pointer" }}
          onClick={redirectToVaultDetail}
        >
          <AppFlexBox sx={{ justifyContent: "flex-start", gap: "11px" }}>
            <VaultListItemImageWrapper>
              <img
                src={getTokenLogoURL(token.symbol)}
                alt={token.name}
                data-testid={`vaultRow-${vaultTestId}-tokenImg`}
              />
            </VaultListItemImageWrapper>
            <Box>
              {vaultPosition?.balancePosition &&
              BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) &&
              !shutdown ? (
                <VaultTagLabel>Earning</VaultTagLabel>
              ) : shutdown ? (
                <VaultTagLabel>Finished</VaultTagLabel>
              ) : (
                <VaultTagLabel>Live</VaultTagLabel>
              )}
              <VaultTitle data-testid={`vaultRow-${vaultTestId}-tokenTitle`}>
                {vaultItemData.name}
              </VaultTitle>
            </Box>
          </AppFlexBox>
        </TableCell>
        <TableCell
          colSpan={1}
          sx={{ width: "11%" }}
          data-testid={`vaultRow-${vaultTestId}-earnedValueCell`}
        >
          <VaultEarned>
            {balanceEarned && BigNumber(balanceEarned).isGreaterThan(0) ? (
              "$" +
              formatNumber(
                BigNumber(balanceEarned)
                  .multipliedBy(fxdPrice)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )
            ) : balanceEarned === -1 ? (
              <CircularProgress size={20} />
            ) : (
              0
            )}
          </VaultEarned>
        </TableCell>
        <TableCell
          colSpan={1}
          sx={{ width: "10%" }}
          data-testid={`vaultRow-${vaultTestId}-aprValueCell`}
        >
          <VaultApr>{formattedApr}%</VaultApr>
        </TableCell>
        <TableCell
          colSpan={2}
          data-testid={`vaultRow-${vaultTestId}-tvlValueCell`}
          sx={{ width: "13%" }}
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
          sx={{ width: "14%" }}
        >
          <VaultAvailable className={"blue"}>
            {isTfVaultType
              ? formatNumber(
                  BigNumber(tfVaultDepositLimit)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )
              : formatNumber(
                  Math.max(
                    BigNumber(depositLimit)
                      .minus(BigNumber(balanceTokens))
                      .dividedBy(10 ** 18)
                      .toNumber(),
                    0
                  )
                )}{" "}
            {token.symbol}
          </VaultAvailable>
        </TableCell>
        <TableCell
          colSpan={1}
          sx={{ width: "15%" }}
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
        <TableCell colSpan={4}>
          <AppFlexBox
            sx={{ justifyContent: "flex-end", gap: "16px", mx: "16px" }}
          >
            {(!vaultPosition ||
              !BigNumber(vaultPosition.balanceShares).isGreaterThan(0)) &&
              !shutdown &&
              activeTfPeriod !== 2 && (
                <ButtonPrimary
                  onClick={() => setNewVaultDeposit(true)}
                  data-testid={`vaultRow-${vaultTestId}-depositButton`}
                  sx={{ height: "36px", minWidth: "100px" }}
                >
                  Deposit
                </ButtonPrimary>
              )}
            {vaultPosition &&
              BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
              !shutdown &&
              activeTfPeriod !== 2 && (
                <ButtonPrimary
                  onClick={() => setManageVault(true)}
                  data-testid={`vaultRowDetails-${vaultTestId}-managePositionButton`}
                  sx={{ height: "36px", minWidth: "100px" }}
                >
                  Manage
                </ButtonPrimary>
              )}
            {vaultPosition &&
              BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
              shutdown &&
              activeTfPeriod < 2 && (
                <ButtonPrimary
                  onClick={() => setManageVault(true)}
                  sx={{ height: "36px", minWidth: "100px" }}
                >
                  Withdraw
                </ButtonPrimary>
              )}
            {vaultPosition &&
              BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
              isTfVaultType &&
              activeTfPeriod === 2 && (
                <ButtonPrimary
                  onClick={handleWithdrawAll}
                  disabled={isWithdrawLoading || !showWithdrawAllButton}
                  sx={{ height: "36px", minWidth: "100px" }}
                >
                  Withdraw all
                </ButtonPrimary>
              )}
          </AppFlexBox>
        </TableCell>
      </BaseTableItemRow>
      {useMemo(() => {
        return (
          newVaultDeposit && (
            <VaultListItemDepositModal
              vaultItemData={vaultItemData}
              performanceFee={performanceFee}
              isTfVaultType={isTfVaultType}
              isUserKycPassed={isUserKycPassed}
              tfVaultDepositEndDate={tfVaultDepositEndDate}
              tfVaultLockEndDate={tfVaultLockEndDate}
              activeTfPeriod={activeTfPeriod}
              minimumDeposit={minimumDeposit}
              onClose={() => setNewVaultDeposit(false)}
            />
          )
        );
      }, [newVaultDeposit, setNewVaultDeposit])}
      {useMemo(() => {
        return (
          manageVault &&
          vaultPosition && (
            <VaultListItemManageModal
              vaultItemData={vaultItemData}
              vaultPosition={vaultPosition}
              performanceFee={performanceFee}
              isTfVaultType={isTfVaultType}
              tfVaultDepositEndDate={tfVaultDepositEndDate}
              tfVaultLockEndDate={tfVaultLockEndDate}
              activeTfPeriod={activeTfPeriod}
              minimumDeposit={minimumDeposit}
              onClose={() => setManageVault(false)}
            />
          )
        );
      }, [manageVault, setManageVault])}
    </>
  );
};

export default memo(VaultListItem);
