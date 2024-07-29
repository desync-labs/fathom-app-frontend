import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { Box, SvgIcon, Typography } from "@mui/material";
import { formatUnits } from "fathom-ethers/lib/utils";
import { DarkTooltip } from "apps/lending/components/infoTooltips/DarkTooltip";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";

import { BorrowRateModeBlock } from "apps/lending/modules/history/actions/BorrowRateModeBlock";
import { fetchIconSymbolAndNameHistorical } from "apps/lending/modules/history/helpers";
import { PriceUnavailable } from "apps/lending/modules/history/PriceUnavailable";
import {
  ActionFields,
  TransactionHistoryItem,
} from "apps/lending/modules/history/types";
import { FC } from "react";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";

export const ActionTextMap: FC<{ action: string }> = ({ action }) => {
  switch (action) {
    case "Supply":
    case "Deposit":
      return <>Supply</>;
    case "Borrow":
      return <>Borrow</>;
    case "RedeemUnderlying":
      return <>Withdraw</>;
    case "Repay":
      return <>Repay</>;
    case "UsageAsCollateral":
      return <>Collateral usage</>;
    case "SwapBorrowRate":
    case "Swap":
      return <>Borrow rate change</>;
    case "LiquidationCall":
      return <>Liquidation</>;
    case "UserEModeSet":
      return <>E-Mode</>;
    case "ClaimRewardsCall":
      return <>Claim Rewards</>;
    default:
      return <></>;
  }
};

export const ActionDetails = <K extends keyof ActionFields>({
  transaction,
  iconSize,
}: {
  transaction: TransactionHistoryItem<ActionFields[K]>;
  iconSize: string;
}) => {
  switch (transaction.action) {
    case "Supply":
    case "Deposit":
      const supplyTx = transaction as TransactionHistoryItem<
        ActionFields["Supply"]
      >;
      const formattedSupplyReserve = fetchIconSymbolAndNameHistorical(
        supplyTx.reserve
      );
      const formattedSupplyAmount = formatUnits(
        supplyTx.amount,
        supplyTx.reserve.decimals
      );
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TokenIcon
            symbol={formattedSupplyReserve.iconSymbol}
            sx={{ fontSize: iconSize }}
          />
          <Typography
            variant="secondary14"
            color="text.light"
            sx={{
              ml:
                formattedSupplyReserve.iconSymbol.split("_").length > 1
                  ? 1.5
                  : 0.5,
              mb: 0.25,
            }}
          >
            +
          </Typography>
          <DarkTooltip
            wrap
            title={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <PriceUnavailable
                  value={
                    Number(supplyTx.assetPriceUSD) *
                    Number(formattedSupplyAmount)
                  }
                />
                <Box sx={{ display: "flex" }}>
                  <FormattedNumber
                    value={formattedSupplyAmount}
                    variant="secondary14"
                    color="common.white"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="secondary14" color="common.white">
                    {formattedSupplyReserve.symbol}
                  </Typography>
                </Box>
              </Box>
            }
            arrow
            placement="top"
          >
            <Box>
              <FormattedNumber
                value={formattedSupplyAmount}
                variant="secondary14"
                color="text.light"
                compact
                compactThreshold={100000}
                sx={{ mr: 0.5 }}
              />
            </Box>
          </DarkTooltip>
          <DarkTooltip
            title={
              <Typography variant="secondary14" color="common.white">
                {formattedSupplyReserve.name} ({formattedSupplyReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography variant="secondary14" color="text.light">
              {formattedSupplyReserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case "Borrow":
      const borrowTx = transaction as TransactionHistoryItem<
        ActionFields["Borrow"]
      >;
      const formattedBorrowReserve = fetchIconSymbolAndNameHistorical(
        borrowTx.reserve
      );
      const formattedBorrowAmount = formatUnits(
        borrowTx.amount,
        borrowTx.reserve.decimals
      );
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <TokenIcon
            symbol={formattedBorrowReserve.iconSymbol}
            sx={{ fontSIze: iconSize }}
          />
          <Typography
            variant="secondary14"
            color="text.light"
            sx={{
              ml:
                formattedBorrowReserve.iconSymbol.split("_").length > 1
                  ? 1.5
                  : 0.5,
              mb: 0.25,
            }}
          >
            &minus;
          </Typography>
          <DarkTooltip
            wrap
            title={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <PriceUnavailable
                  value={
                    Number(borrowTx.assetPriceUSD) *
                    Number(formattedBorrowAmount)
                  }
                />
                <Box sx={{ display: "flex" }}>
                  <FormattedNumber
                    value={formattedBorrowAmount}
                    variant="secondary14"
                    color="common.white"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="secondary14" color="common.white">
                    {formattedBorrowReserve.symbol}
                  </Typography>
                </Box>
              </Box>
            }
            arrow
            placement="top"
          >
            <Box>
              <FormattedNumber
                value={formattedBorrowAmount}
                variant="secondary14"
                color="text.light"
                sx={{ mr: 0.5 }}
                compact
                compactThreshold={100000}
              />
            </Box>
          </DarkTooltip>
          <DarkTooltip
            title={
              <Typography variant="secondary14" color="common.white">
                {formattedBorrowReserve.name} ({formattedBorrowReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography variant="secondary14" color="text.light">
              {formattedBorrowReserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case "RedeemUnderlying":
      const withdrawTx = transaction as TransactionHistoryItem<
        ActionFields["RedeemUnderlying"]
      >;
      const formattedWithdrawReserve = fetchIconSymbolAndNameHistorical(
        withdrawTx.reserve
      );
      const formattedWithdrawAmount = formatUnits(
        withdrawTx.amount,
        withdrawTx.reserve.decimals
      );
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <TokenIcon
            symbol={formattedWithdrawReserve.iconSymbol}
            sx={{ fontSIze: iconSize }}
          />
          <Typography
            variant="secondary14"
            color="text.light"
            sx={{
              ml:
                formattedWithdrawReserve.iconSymbol.split("_").length > 1
                  ? 1.5
                  : 0.5,
              mb: 0.25,
            }}
          >
            &minus;
          </Typography>
          <DarkTooltip
            wrap
            title={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <PriceUnavailable
                  value={
                    Number(withdrawTx.assetPriceUSD) *
                    Number(formattedWithdrawAmount)
                  }
                />
                <Box sx={{ display: "flex" }}>
                  <FormattedNumber
                    value={formattedWithdrawAmount}
                    variant="secondary14"
                    color="common.white"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="secondary14" color="common.white">
                    {formattedWithdrawReserve.symbol}
                  </Typography>
                </Box>
              </Box>
            }
            arrow
            placement="top"
          >
            <Box>
              <FormattedNumber
                value={formattedWithdrawAmount}
                variant="secondary14"
                color="text.light"
                sx={{ mr: 1 }}
                compact
                compactThreshold={100000}
              />
            </Box>
          </DarkTooltip>
          <DarkTooltip
            title={
              <Typography variant="secondary14" color="common.white">
                {formattedWithdrawReserve.name} (
                {formattedWithdrawReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography variant="secondary14" color="text.light">
              {formattedWithdrawReserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case "Repay":
      const repayTx = transaction as TransactionHistoryItem<
        ActionFields["Repay"]
      >;
      const formattedRepayReserve = fetchIconSymbolAndNameHistorical(
        repayTx.reserve
      );
      const formattedRepayAmount = formatUnits(
        repayTx.amount,
        repayTx.reserve.decimals
      );
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <TokenIcon
            symbol={formattedRepayReserve.iconSymbol}
            sx={{ fontSIze: iconSize }}
          />
          <Typography
            variant="secondary14"
            color="text.light"
            sx={{
              ml:
                formattedRepayReserve.iconSymbol.split("_").length > 1
                  ? 1.5
                  : 0.5,
              mb: 0.25,
            }}
          >
            +
          </Typography>
          <DarkTooltip
            wrap
            title={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <PriceUnavailable
                  value={
                    Number(repayTx.assetPriceUSD) * Number(formattedRepayAmount)
                  }
                />
                <Box sx={{ display: "flex" }}>
                  <FormattedNumber
                    value={formattedRepayAmount}
                    variant="secondary14"
                    color="common.white"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="secondary14" color="common.white">
                    {formattedRepayReserve.symbol}
                  </Typography>
                </Box>
              </Box>
            }
            arrow
            placement="top"
          >
            <Box>
              <FormattedNumber
                value={formattedRepayAmount}
                variant="secondary14"
                color="text.light"
                sx={{ mr: 0.5 }}
                compact
                compactThreshold={100000}
                symbolsColor="text.light"
              />
            </Box>
          </DarkTooltip>
          <DarkTooltip
            title={
              <Typography variant="secondary14" color="common.white">
                {formattedRepayReserve.name} ({formattedRepayReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography variant="secondary14" color="text.light">
              {formattedRepayReserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case "UsageAsCollateral":
      const collateralUsageTx = transaction as TransactionHistoryItem<
        ActionFields["UsageAsCollateral"]
      >;
      const formattedCollateralReserve = fetchIconSymbolAndNameHistorical(
        collateralUsageTx.reserve
      );
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <Typography variant="description" color="text.light">
            Collateralization
          </Typography>
          {collateralUsageTx.toState === true ? (
            <Typography
              variant="subheader1"
              color="success.main"
              sx={{ px: 0.75 }}
            >
              enabled
            </Typography>
          ) : (
            <Typography
              variant="subheader1"
              color="error.main"
              sx={{ px: 0.75 }}
            >
              disabled
            </Typography>
          )}
          <Typography variant="description" color="text.light" sx={{ mr: 0.5 }}>
            for
          </Typography>
          <TokenIcon
            symbol={formattedCollateralReserve.iconSymbol}
            sx={{
              fontSIze: iconSize,
            }}
          />
          <DarkTooltip
            title={
              <Typography variant="secondary14" color="common.white">
                {formattedCollateralReserve.name} (
                {formattedCollateralReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography
              variant="secondary14"
              color="text.light"
              sx={{
                ml:
                  formattedCollateralReserve.iconSymbol.split("_").length > 1
                    ? 1.5
                    : 0.5,
              }}
            >
              {formattedCollateralReserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case "SwapBorrowRate":
    case "Swap":
      const swapBorrowRateTx = transaction as TransactionHistoryItem<
        ActionFields["SwapBorrowRate"]
      >;
      const formattedSwapReserve = fetchIconSymbolAndNameHistorical(
        swapBorrowRateTx.reserve
      );
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <BorrowRateModeBlock
            borrowRateMode={swapBorrowRateTx.borrowRateModeFrom.toString()}
            swapBorrowRateTx={swapBorrowRateTx}
          />
          <SvgIcon sx={{ fontSize: "28px", px: 0.5 }}>
            <ArrowRightAltRoundedIcon />
          </SvgIcon>
          <BorrowRateModeBlock
            borrowRateMode={swapBorrowRateTx.borrowRateModeTo.toString()}
            swapBorrowRateTx={swapBorrowRateTx}
          />
          <Typography variant="caption" color="text.secondary" px={1}>
            for
          </Typography>
          <TokenIcon
            symbol={formattedSwapReserve.iconSymbol}
            sx={{ fontSIze: iconSize }}
          />
          <DarkTooltip
            title={
              <Typography variant="secondary14" color="common.white">
                {formattedSwapReserve.name} ({formattedSwapReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography
              variant="secondary14"
              color="text.light"
              sx={{
                ml:
                  formattedSwapReserve.iconSymbol.split("_").length > 1
                    ? 1.5
                    : 0.5,
              }}
            >
              {swapBorrowRateTx.reserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case "LiquidationCall":
      const liquidationTx = transaction as TransactionHistoryItem<
        ActionFields["LiquidationCall"]
      >;
      const formattedLiquidationColatReserve = fetchIconSymbolAndNameHistorical(
        liquidationTx.collateralReserve
      );
      const formattedLiquidationBorrowReserve =
        fetchIconSymbolAndNameHistorical(liquidationTx.principalReserve);
      const formattedCollateralAmount = formatUnits(
        liquidationTx.collateralAmount,
        liquidationTx.collateralReserve.decimals
      );
      const formattedLiquidationBorrowAmount = formatUnits(
        liquidationTx.principalAmount,
        liquidationTx.principalReserve.decimals
      );
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }} pr={2.25}>
            <Typography>Liquidated collateral</Typography>
            <Box sx={{ display: "inline-flex" }}>
              <TokenIcon
                symbol={formattedLiquidationColatReserve.iconSymbol}
                sx={{ fontSIze: iconSize, pr: 0.25 }}
              />
              <Box
                sx={{
                  ml:
                    formattedLiquidationColatReserve.iconSymbol.split("_")
                      .length > 1
                      ? 3
                      : 1,
                  display: "inline-flex",
                }}
              >
                <Typography
                  variant="secondary14"
                  color="text.light"
                  sx={{ display: "inline-flex", mb: 0.25 }}
                >
                  &minus;
                </Typography>
                <DarkTooltip
                  wrap
                  title={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <PriceUnavailable
                        value={
                          Number(liquidationTx.collateralAssetPriceUSD) *
                          Number(formattedCollateralAmount)
                        }
                      />
                      <Box sx={{ display: "flex" }}>
                        <FormattedNumber
                          value={formattedCollateralAmount}
                          variant="secondary14"
                          color="common.white"
                          sx={{ mr: 0.5 }}
                        />
                        <Typography variant="secondary14" color="common.white">
                          {formattedLiquidationColatReserve.symbol}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <Box>
                    <FormattedNumber
                      value={formattedCollateralAmount}
                      variant="secondary14"
                      color="text.light"
                      sx={{ mr: 0.5 }}
                      compact
                      compactThreshold={100000}
                    />
                  </Box>
                </DarkTooltip>
                <DarkTooltip
                  title={
                    <Typography variant="secondary14" color="common.white">
                      {formattedLiquidationColatReserve.name} (
                      {formattedLiquidationColatReserve.symbol})
                    </Typography>
                  }
                  arrow
                  placement="top"
                >
                  <Typography
                    variant="secondary14"
                    color="text.light"
                    sx={{ display: "inline-flex" }}
                  >
                    {formattedLiquidationColatReserve.symbol}
                  </Typography>
                </DarkTooltip>
              </Box>
            </Box>
          </Box>
          <SvgIcon sx={{ fontSize: "20px" }}>
            <ArrowRightAltRoundedIcon />
          </SvgIcon>
          <Box sx={{ display: "flex", flexDirection: "column" }} pl={4.5}>
            <Typography>Covered debt</Typography>
            <Box sx={{ display: "inline-flex" }}>
              <TokenIcon
                symbol={formattedLiquidationBorrowReserve.iconSymbol}
                sx={{ fontSIze: iconSize, pr: 0.25 }}
              />
              <Box
                sx={{
                  ml:
                    formattedLiquidationBorrowReserve.iconSymbol.split("_")
                      .length > 1
                      ? 1.5
                      : 0.5,
                  display: "inline-flex",
                }}
              >
                <Typography
                  variant="secondary14"
                  color="text.light"
                  sx={{ display: "inline-flex", mb: 0.25 }}
                >
                  +
                </Typography>
                <DarkTooltip
                  wrap
                  title={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <PriceUnavailable
                        value={
                          Number(liquidationTx.borrowAssetPriceUSD) *
                          Number(formattedLiquidationBorrowAmount)
                        }
                      />
                      <Box sx={{ display: "flex" }}>
                        <FormattedNumber
                          value={formattedLiquidationBorrowAmount}
                          variant="secondary14"
                          color="common.white"
                          sx={{ mr: 0.5 }}
                        />
                        <Typography variant="secondary14" color="common.white">
                          {formattedLiquidationBorrowReserve.symbol}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <Box>
                    <FormattedNumber
                      value={formattedLiquidationBorrowAmount}
                      variant="secondary14"
                      color="text.light"
                      sx={{ mr: 0.5 }}
                      compact
                      compactThreshold={100000}
                    />
                  </Box>
                </DarkTooltip>
                <DarkTooltip
                  title={
                    <Typography variant="secondary14" color="common.white">
                      {formattedLiquidationBorrowReserve.name} (
                      {formattedLiquidationBorrowReserve.symbol})
                    </Typography>
                  }
                  arrow
                  placement="top"
                >
                  <Typography
                    variant="secondary14"
                    color="text.light"
                    sx={{ display: "inline-flex" }}
                  >
                    {formattedLiquidationBorrowReserve.symbol}
                  </Typography>
                </DarkTooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    case "UserEModeSet":
      const eModeFields = transaction as TransactionHistoryItem<
        ActionFields["UserEModeSet"]
      >;
      const { eModes } = useAppDataContext();
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <Typography variant="description" color="text.light">
            E-Mode
          </Typography>
          {eModeFields.categoryId !== 0 && eModes ? (
            <>
              <Typography
                variant="subheader1"
                color="success.main"
                sx={{ px: 0.75 }}
              >
                enabled
              </Typography>
              <Typography
                variant="description"
                color="text.light"
                sx={{ mr: 0.5 }}
              >
                for {eModes[eModeFields.categoryId]?.assets?.join(", ")}
              </Typography>
            </>
          ) : (
            <Typography
              variant="subheader1"
              color="error.main"
              sx={{ px: 0.75 }}
            >
              disabled
            </Typography>
          )}
        </Box>
      );
    default:
      return <></>;
  }
};
