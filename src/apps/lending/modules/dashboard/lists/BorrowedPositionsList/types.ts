import { ReserveIncentiveResponse } from "@into-the-fathom/lending-math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";

import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";

export type BorrowedPositionsItem = {
  isActive: boolean;
  isFrozen: boolean;
  borrowingEnabled: boolean;
  stableBorrowRateEnabled: boolean;
  borrowRate: string;
  vIncentives: ReserveIncentiveResponse[];
  sIncentives: ReserveIncentiveResponse[];
  borrowRateMode: string;
  reserve: Pick<
    ComputedReserveData,
    "symbol" | "iconSymbol" | "underlyingAsset" | "id"
  >;
};
