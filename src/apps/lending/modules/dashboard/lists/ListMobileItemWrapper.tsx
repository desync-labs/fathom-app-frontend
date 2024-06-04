import { FC, memo, ReactNode } from "react";
import { CustomMarket } from "apps/lending/ui-config/marketsConfig";
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
    showSupplyCapTooltips = false,
    showBorrowCapTooltips = false,
    showDebtCeilingTooltips = false,
    isIsolated = false,
  }) => {
    return (
      <ListMobileItem
        isIsolated={isIsolated}
        symbol={symbol}
        iconSymbol={iconSymbol}
        name={name}
        underlyingAsset={underlyingAsset}
        warningComponent={null}
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
