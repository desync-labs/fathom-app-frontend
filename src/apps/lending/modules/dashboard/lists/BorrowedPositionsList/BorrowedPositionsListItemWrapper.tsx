import { AssetCapsProvider } from "src/hooks/useAssetCaps";
import { DashboardReserve } from "src/utils/dashboardSortUtils";

import { BorrowedPositionsListItem } from "./BorrowedPositionsListItem";

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
