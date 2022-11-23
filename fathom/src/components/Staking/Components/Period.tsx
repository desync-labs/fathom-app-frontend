import { Chip, Stack } from "@mui/material";
import React, { FC, memo } from "react";
import { styled } from "@mui/material/styles";

const StakingChip = styled(Chip)<{ isActive: boolean }>`
  background: ${({ isActive }) =>
    isActive ? "transparent" : "rgba(79, 101, 140, 0.2)"};
  border-radius: 6px;
  width: 19%;
  cursor: pointer;
  border: ${({ isActive }) =>
    isActive ? "1px solid rgba(79, 101, 140, 0.2)" : "none"};

  &:active {
    border: 1px solid rgba(79, 101, 140, 0.2);
    background: transparent;
  }
`;

type PeriodProps = {
  lockDays: number;
  setPeriod: (days: number) => void;
};

const Period: FC<PeriodProps> = ({ lockDays, setPeriod }) => {
  return (
    <Stack direction="row" spacing={1}>
      <StakingChip
        isActive={lockDays === 30}
        label="1-Month"
        onClick={() => setPeriod(30)}
      />
      <StakingChip
        isActive={lockDays === 60}
        label="2-Month"
        onClick={() => setPeriod(60)}
      />
      <StakingChip
        isActive={lockDays === 90}
        label="3-Month"
        onClick={() => setPeriod(90)}
      />
      <StakingChip
        isActive={lockDays === 180}
        label="Half-Year"
        onClick={() => setPeriod(180)}
      />
      <StakingChip
        isActive={lockDays === 360}
        label="1-Year"
        onClick={() => setPeriod(360)}
      />
    </Stack>
  );
};

export default memo(Period);
