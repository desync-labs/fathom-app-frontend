import { FC } from "react";
import { transparentize } from "polished";
import { Box, styled } from "@mui/material";
import { RowBetween } from "apps/dex/components/Row";
import { AutoColumn } from "apps/dex/components/Column";

const Grouping = styled(RowBetween)`
  width: 50%;
`;

const Circle = styled(Box)<{ confirmed?: boolean; disabled?: boolean }>`
  min-width: 20px;
  min-height: 20px;
  background-color: ${({ confirmed, disabled }) =>
    disabled ? "#565A69" : confirmed ? "#27AE60" : "#253656"};
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 8px;
  font-size: 12px;
`;

const CircleRow = styled(Box)`
  width: calc(100% - 20px);
  display: flex;
  align-items: center;
`;

const Connector = styled(Box)<{ prevConfirmed?: boolean; disabled?: boolean }>`
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    ${({ prevConfirmed, disabled }) =>
        disabled
          ? "#565A69"
          : transparentize(0.5, prevConfirmed ? "#27AE60" : "#253656")}
      0%,
    ${({ prevConfirmed, disabled }) =>
        disabled ? "#565A69" : prevConfirmed ? "#253656" : "#565A69"}
      80%
  );
  opacity: 0.6;
`;

interface ProgressCirclesProps {
  steps: boolean[];
  disabled?: boolean;
}

/**
 * Based on array of steps, create a step counter of circles.
 * A circle can be enabled, disabled, or confirmed. States are derived
 * from a previous step.
 *
 * An extra circle is added to represent the ability to swap, add, or remove.
 * This step will never be marked as complete (because no 'txn done' state in body ui).
 *
 * @param steps  array of booleans where a true means step is complete
 */
const ProgressCircles: FC<ProgressCirclesProps> = ({
  steps,
  disabled = false,
  ...rest
}) => {
  return (
    <AutoColumn justify={"center"} {...rest}>
      <Grouping>
        {steps.map((step, i) => {
          return (
            <CircleRow key={i}>
              <Circle
                confirmed={step}
                disabled={disabled || (!steps[i - 1] && i !== 0)}
              >
                {step ? "✓" : i + 1}
              </Circle>
              <Connector prevConfirmed={step} disabled={disabled} />
            </CircleRow>
          );
        })}
        <Circle disabled={disabled || !steps[steps.length - 1]}>
          {steps.length + 1}
        </Circle>
      </Grouping>
    </AutoColumn>
  );
};

export default ProgressCircles;
