import { FC, useMemo } from "react";
import { Box, Icon } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatPercentage } from "utils/format";

import ArrowUpSrc from "assets/svg/arrow-up.svg";
import ArrowDownSrc from "assets/svg/arrow-down.svg";

type PriceChangeProps = {
  current: number;
  previous: number;
};

const PriceChangedBox = styled(Box)`
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  &.decrease {
    color: #dd3c3c !important;
  }

  &.increase {
    color: #4dcc33 !important;
  }
`;

const IncreaseIcon = () => {
  return (
    <Icon sx={{ width: "17px", height: "30px" }}>
      <img src={ArrowUpSrc} alt="borrow-icon" />
    </Icon>
  );
};

const DecreaseIcon = () => {
  return (
    <Icon sx={{ width: "17px", height: "30px" }}>
      <img src={ArrowDownSrc} alt="borrow-icon" />
    </Icon>
  );
};

const PriceChanged: FC<PriceChangeProps> = ({ current, previous }) => {
  const isNegative = useMemo(() => {
    return current < previous;
  }, [current, previous]);

  const percentage = useMemo(() => {
    if (isNegative) {
      return ((previous - current) / previous) * 100;
    } else {
      return ((current - previous) / previous) * 100;
    }
  }, [current, previous, isNegative]);

  if (current === previous) return null;

  return (
    <PriceChangedBox className={isNegative ? "decrease" : "increase"}>
      {isNegative ? <DecreaseIcon /> : <IncreaseIcon />}
      {formatPercentage(percentage)} %
    </PriceChangedBox>
  );
};

export default PriceChanged;
