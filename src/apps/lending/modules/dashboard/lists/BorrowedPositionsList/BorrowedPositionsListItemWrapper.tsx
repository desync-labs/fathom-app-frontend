import { AssetCapsProvider } from "apps/lending/hooks/useAssetCaps";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";

import { BorrowedPositionsListItem } from "apps/lending/modules/dashboard/lists/BorrowedPositionsList/BorrowedPositionsListItem";
import { FC } from "react";

export const BorrowedPositionsListItemWrapper: FC<{
  item: DashboardReserve;
}> = ({ item }) => {
  return (
    <AssetCapsProvider asset={item.reserve}>
      <BorrowedPositionsListItem item={item} />
    </AssetCapsProvider>
  );
};
