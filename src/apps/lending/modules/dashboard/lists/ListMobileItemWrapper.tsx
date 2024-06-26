import { FC, memo, ReactNode } from "react";
import { CustomMarket } from "apps/lending/ui-config/marketsConfig";
import { ListMobileItem } from "apps/lending/components/lists/ListMobileItem";
import { FrozenTooltip } from "apps/lending/components/infoTooltips/FrozenTooltip";
import { BorrowDisabledToolTip } from "apps/lending/components/infoTooltips/BorrowDisabledToolTip";

// These are all optional due to MobileListItemLoader
interface ListMobileItemWrapperProps {
  symbol?: string;
  iconSymbol?: string;
  name?: string;
  underlyingAsset?: string;
  children: ReactNode;
  loading?: boolean;
  currentMarket?: CustomMarket;
  showSupplyCapTooltips?: boolean;
  showBorrowCapTooltips?: boolean;
  showDebtCeilingTooltips?: boolean;
  isIsolated?: boolean;
  frozen?: boolean;
  borrowEnabled?: boolean;
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
    showSupplyCapTooltips = false,
    showBorrowCapTooltips = false,
    showDebtCeilingTooltips = false,
    isIsolated = false,
    borrowEnabled = true,
    frozen,
  }) => {
    const WarningComponent: FC = () => {
      const showBorrowDisabledTooltip = !frozen && !borrowEnabled;
      const showFrozenTooltip = frozen;
      return (
        <>
          {showFrozenTooltip && <FrozenTooltip />}
          {showBorrowDisabledTooltip && symbol && currentMarket && (
            <BorrowDisabledToolTip />
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
