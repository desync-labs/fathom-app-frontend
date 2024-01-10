import { AssetCapsProvider } from "apps/lending/hooks/useAssetCaps";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";

import { BorrowedPositionsListItem } from "apps/lending/modules/dashboard/lists/BorrowedPositionsList/BorrowedPositionsListItem";

export const BorrowedPositionsListItemWrapper = ({
  item,
}: {
  item: DashboardReserve;
}) => {
  return (
    <AssetCapsProvider asset={item.reserve}>
      <BorrowedPositionsListItem item={item} />
    </AssetCapsProvider>
  );
};
