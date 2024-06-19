import { InterestRate } from "@into-the-fathom/lending-contract-helpers";
import { ReserveIncentiveResponse } from "@into-the-fathom/lending-math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { IncentivesCard } from "apps/lending/components/incentives/IncentivesCard";
import { APYTypeTooltip } from "apps/lending/components/infoTooltips/APYTypeTooltip";
import { Row } from "apps/lending/components/primitives/Row";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";
import { isFeatureEnabled } from "apps/lending/utils/marketsAndNetworksConfig";

import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListAPRColumn } from "apps/lending/modules/dashboard/lists/ListAPRColumn";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";
import { ListItemAPYButton } from "apps/lending/modules/dashboard/lists/ListItemAPYButton";
import { ListItemWrapper } from "apps/lending/modules/dashboard/lists/ListItemWrapper";
import { ListMobileItemWrapper } from "apps/lending/modules/dashboard/lists/ListMobileItemWrapper";
import { ListValueColumn } from "apps/lending/modules/dashboard/lists/ListValueColumn";
import { ListValueRow } from "apps/lending/modules/dashboard/lists/ListValueRow";
import { FC } from "react";

export const BorrowedPositionsListItem: FC<{ item: DashboardReserve }> = ({
  item,
}) => {
  const { borrowCap } = useAssetCaps();
  const { currentMarket, currentMarketData } = useProtocolDataContext();
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down("xsm"));
  const { openBorrow, openRepay, openRateSwitch, openDebtSwitch } =
    useModalContext();

  const reserve = item.reserve;

  const disableBorrow =
    !reserve.isActive ||
    !reserve.borrowingEnabled ||
    reserve.isFrozen ||
    reserve.isPaused ||
    borrowCap.isMaxed;

  const disableRepay = !reserve.isActive || reserve.isPaused;

  const showSwitchButton =
    isFeatureEnabled.debtSwitch(currentMarketData) || false;
  const disableSwitch =
    reserve.isPaused || !reserve.isActive || reserve.symbol == "stETH";

  const props: BorrowedPositionsListItemProps = {
    ...item,
    disableBorrow,
    disableSwitch,
    disableRepay,
    showSwitchButton,
    totalBorrows:
      item.borrowRateMode === InterestRate.Variable
        ? item.variableBorrows
        : item.stableBorrows,
    totalBorrowsUSD:
      item.borrowRateMode === InterestRate.Variable
        ? item.variableBorrowsUSD
        : item.stableBorrowsUSD,
    borrowAPY:
      item.borrowRateMode === InterestRate.Variable
        ? Number(reserve.variableBorrowAPY)
        : Number(item.stableBorrowAPY),
    incentives:
      item.borrowRateMode === InterestRate.Variable
        ? reserve.vIncentivesData
        : reserve.sIncentivesData,
    onDetbSwitchClick: () => {
      openDebtSwitch(reserve.underlyingAsset, item.borrowRateMode);
    },
    onOpenBorrow: () => {
      openBorrow(
        reserve.underlyingAsset,
        currentMarket,
        reserve.name,
        "dashboard"
      );
    },
    onOpenRepay: () => {
      openRepay(
        reserve.underlyingAsset,
        item.borrowRateMode,
        reserve.isFrozen,
        currentMarket,
        reserve.name,
        "dashboard"
      );
    },
    onOpenRateSwitch: () => {
      openRateSwitch(reserve.underlyingAsset, item.borrowRateMode);
    },
  };

  if (downToXSM) {
    return <BorrowedPositionsListItemMobile {...props} />;
  } else {
    return <BorrowedPositionsListItemDesktop {...props} />;
  }
};

interface BorrowedPositionsListItemProps extends DashboardReserve {
  disableBorrow: boolean;
  disableSwitch: boolean;
  disableRepay: boolean;
  showSwitchButton: boolean;
  borrowAPY: number;
  incentives: ReserveIncentiveResponse[] | undefined;
  onDetbSwitchClick: () => void;
  onOpenBorrow: () => void;
  onOpenRepay: () => void;
  onOpenRateSwitch: () => void;
}

const BorrowedPositionsListItemDesktop = ({
  reserve,
  borrowRateMode,
  disableBorrow,
  disableSwitch,
  disableRepay,
  showSwitchButton,
  totalBorrows,
  totalBorrowsUSD,
  borrowAPY,
  incentives,
  onDetbSwitchClick,
  onOpenBorrow,
  onOpenRepay,
  onOpenRateSwitch,
}: BorrowedPositionsListItemProps) => {
  const { currentMarket } = useProtocolDataContext();

  const { isActive, isFrozen, isPaused, stableBorrowRateEnabled, name } =
    reserve;

  return (
    <ListItemWrapper
      symbol={reserve.symbol}
      iconSymbol={reserve.iconSymbol}
      name={name}
      detailsAddress={reserve.underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve.isFrozen}
      borrowEnabled={reserve.borrowingEnabled}
      data-cy={`dashboardBorrowedListItem_${reserve.symbol.toUpperCase()}_${borrowRateMode}`}
      showBorrowCapTooltips
    >
      <ListValueColumn
        symbol={reserve.symbol}
        value={totalBorrows}
        subValue={totalBorrowsUSD}
      />

      <ListAPRColumn
        value={borrowAPY}
        incentives={incentives}
        symbol={reserve.symbol}
      />

      <ListColumn>
        <ListItemAPYButton
          stableBorrowRateEnabled={stableBorrowRateEnabled}
          borrowRateMode={borrowRateMode}
          disabled={
            !stableBorrowRateEnabled || isFrozen || !isActive || isPaused
          }
          onClick={onOpenRateSwitch}
          stableBorrowAPY={reserve.stableBorrowAPY}
          variableBorrowAPY={reserve.variableBorrowAPY}
          underlyingAsset={reserve.underlyingAsset}
          currentMarket={currentMarket}
        />
      </ListColumn>

      <ListButtonsColumn>
        {showSwitchButton ? (
          <Button
            disabled={disableSwitch}
            variant="gradient"
            onClick={onDetbSwitchClick}
            data-cy={`swapButton`}
          >
            <>Switch</>
          </Button>
        ) : (
          <Button
            disabled={disableBorrow}
            variant="gradient"
            onClick={onOpenBorrow}
          >
            <>Borrow</>
          </Button>
        )}
        <Button
          disabled={disableRepay}
          variant="outlined"
          onClick={onOpenRepay}
        >
          <>Repay</>
        </Button>
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};

const BorrowedPositionsListItemMobile = ({
  reserve,
  borrowRateMode,
  totalBorrows,
  totalBorrowsUSD,
  disableBorrow,
  showSwitchButton,
  disableSwitch,
  borrowAPY,
  incentives,
  disableRepay,
  onDetbSwitchClick,
  onOpenBorrow,
  onOpenRepay,
  onOpenRateSwitch,
}: BorrowedPositionsListItemProps) => {
  const { currentMarket } = useProtocolDataContext();

  const {
    symbol,
    iconSymbol,
    name,
    isActive,
    isFrozen,
    isPaused,
    stableBorrowRateEnabled,
    variableBorrowAPY,
    stableBorrowAPY,
    underlyingAsset,
  } = reserve;

  return (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={reserve.underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve.isFrozen}
      borrowEnabled={reserve.borrowingEnabled}
      showBorrowCapTooltips
    >
      <ListValueRow
        title={<>Debt</>}
        value={totalBorrows}
        subValue={totalBorrowsUSD}
        disabled={Number(totalBorrows) === 0}
      />

      <Row
        caption={<>APY</>}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <IncentivesCard
          value={borrowAPY}
          incentives={incentives}
          symbol={symbol}
          variant="secondary14"
        />
      </Row>

      <Row
        caption={
          <APYTypeTooltip
            text={<>APY type</>}
            key="APY type"
            variant="description"
          />
        }
        captionVariant="description"
        mb={2}
      >
        <ListItemAPYButton
          stableBorrowRateEnabled={stableBorrowRateEnabled}
          borrowRateMode={borrowRateMode}
          disabled={
            !stableBorrowRateEnabled || isFrozen || !isActive || isPaused
          }
          onClick={onOpenRateSwitch}
          stableBorrowAPY={stableBorrowAPY}
          variableBorrowAPY={variableBorrowAPY}
          underlyingAsset={underlyingAsset}
          currentMarket={currentMarket}
        />
      </Row>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 5,
        }}
      >
        {showSwitchButton ? (
          <Button
            disabled={disableSwitch}
            variant="gradient"
            fullWidth
            onClick={onDetbSwitchClick}
            data-cy={`swapButton`}
          >
            <>Switch</>
          </Button>
        ) : (
          <Button
            disabled={disableBorrow}
            variant="gradient"
            onClick={onOpenBorrow}
            fullWidth
            sx={{ mr: 1.5 }}
          >
            <>Borrow</>
          </Button>
        )}
        <Button
          disabled={disableRepay}
          variant="outlined"
          onClick={onOpenRepay}
          fullWidth
        >
          <>Repay</>
        </Button>
      </Box>
    </ListMobileItemWrapper>
  );
};
