import { reserveRateTimeRangeOptions } from "apps/lending/hooks/useReservesHistory";

import {
  ESupportedTimeRanges,
  TimeRangeSelector,
} from "apps/lending/modules/reserve-overview/TimeRangeSelector";
import { FC } from "react";

export interface GraphTimeRangeSelectorProps {
  disabled: boolean;
  timeRange: ESupportedTimeRanges;
  onTimeRangeChanged: (value: ESupportedTimeRanges) => void;
}

export const GraphTimeRangeSelector: FC<GraphTimeRangeSelectorProps> = ({
  disabled, // require disabled from parent
  timeRange,
  onTimeRangeChanged,
}) => (
  <TimeRangeSelector
    disabled={disabled}
    timeRanges={reserveRateTimeRangeOptions}
    selectedTimeRange={timeRange}
    onTimeRangeChanged={onTimeRangeChanged}
  />
);
