import { Chip, Stack } from "@mui/material";
import { FC, memo } from "react";
import { styled } from "@mui/material/styles";
import useSharedContext from "context/shared";

const StakingChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive: boolean }>`
  background: ${({ isActive }) =>
    isActive ? "transparent" : "rgba(79, 101, 140, 0.2)"};
  border-radius: 6px;
  width: 17%;
  cursor: pointer;
  border: ${({ isActive }) =>
    isActive ? "1px solid rgba(79, 101, 140, 0.2)" : "none"};

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 30%;
    margin-bottom: 12px;
    margin-right: 5%;
    &:nth-of-type(3n) {
      margin-right: 0;
    }
  }

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
  const { isMobile } = useSharedContext();

  return (
    <Stack direction="row" spacing={isMobile ? 0 : 1} flexWrap={"wrap"}>
      <StakingChip
        isActive={lockDays === 30}
        label="1-Month"
        onClick={() => setPeriod(30)}
      />
      <StakingChip
        isActive={lockDays === 61}
        label="2-Month"
        onClick={() => setPeriod(61)}
      />
      <StakingChip
        isActive={lockDays === 92}
        label="3-Month"
        onClick={() => setPeriod(92)}
      />
      <StakingChip
        isActive={lockDays === 183}
        label="Half-Year"
        onClick={() => setPeriod(183)}
      />
      <StakingChip
        isActive={lockDays === 365}
        label="1-Year"
        onClick={() => setPeriod(365)}
      />
    </Stack>
  );
};

export default memo(Period);
