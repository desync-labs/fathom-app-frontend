import { FC, memo, ReactNode } from "react";
import { BorrowDisabledToolTip } from "apps/lending/components/infoTooltips/BorrowDisabledToolTip";
import { CustomMarket } from "apps/lending/ui-config/marketsConfig";
import { FrozenTooltip } from "apps/lending/components/infoTooltips/FrozenTooltip";
import { ListMobileItem } from "apps/lending/components/lists/ListMobileItem";

// These are all optional due to MobileListItemLoader
interface ListMobileItemWrapperProps {
  symbol?: string;
  iconSymbol?: string;
  name?: string;
  underlyingAsset?: string;
  children: ReactNode;
  loading?: boolean;
  currentMarket?: CustomMarket;
  frozen?: boolean;
  borrowEnabled?: boolean;
  showSupplyCapTooltips?: boolean;
  showBorrowCapTooltips?: boolean;
  showDebtCeilingTooltips?: boolean;
  isIsolated?: boolean;
}

export const ListMobileItemWrapper: FC<ListMobileItemWrapperProps> = memo(
  ({
    symbol,
    iconSymbol,
    name,
    children,
    underlyingAsset,
    loading,
    currentMarket,
    frozen,
    borrowEnabled = true,
    showSupplyCapTooltips = false,
    showBorrowCapTooltips = false,
    showDebtCeilingTooltips = false,
    isIsolated = false,
  }) => {
    const WarningComponent: FC = () => {
      const showFrozenTooltip = frozen;
      const showBorrowDisabledTooltip = !frozen && !borrowEnabled;
      return (
        <>
          {showFrozenTooltip && (
            <FrozenTooltip symbol={symbol} currentMarket={currentMarket} />
          )}
          {showBorrowDisabledTooltip && symbol && currentMarket && (
            <BorrowDisabledToolTip
              symbol={symbol}
              currentMarket={currentMarket}
            />
          )}
        </>
      );
    };

    return (
      <ListMobileItem
        isIsolated={isIsolated}
        symbol={symbol}
        iconSymbol={iconSymbol}
        name={name}
        underlyingAsset={underlyingAsset}
        warningComponent={<WarningComponent />}
        loading={loading}
        currentMarket={currentMarket}
        showSupplyCapTooltips={showSupplyCapTooltips}
        showBorrowCapTooltips={showBorrowCapTooltips}
        showDebtCeilingTooltips={showDebtCeilingTooltips}
      >
        {children}
      </ListMobileItem>
    );
  }
);
