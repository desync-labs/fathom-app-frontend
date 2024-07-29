import { useState, useRef, FC } from "react";
import { styled } from "@mui/material";

import QuestionHelper from "apps/dex/components/QuestionHelper";
import { TYPE } from "apps/dex/theme";
import { AutoColumn } from "apps/dex/components/Column";
import { RowBetween, RowFixed } from "apps/dex/components/Row";

enum SlippageError {
  InvalidInput = "InvalidInput",
  RiskyLow = "RiskyLow",
  RiskyHigh = "RiskyHigh",
}

enum DeadlineError {
  InvalidInput = "InvalidInput",
}

const FancyButton = styled("button")`
  color: #b7c8e5;
  align-items: center;
  height: 2rem;
  border-radius: 36px;
  font-size: 1rem;
  width: auto;
  min-width: 3.5rem;
  border: 1px solid transparent;
  outline: none;
  background: #131f35;
  :hover {
    border: 1px solid #b7c8e5;
    cursor: pointer;
  }
  :focus {
    border: 1px solid #253656;
  }
  &.active {
    color: #fff;
    border: 1px solid #b7c8e5;
  }
`;

const Option = styled(FancyButton)<{ active: boolean }>`
  margin-right: 8px;
  border: none;
  background-color: ${({ active }) => active && "#253656"};
`;

const Input = styled("input")`
  background: #131f35;
  font-size: 16px;
  width: auto;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ color }) => (color === "red" ? "#FD4040" : "#fff")};
  text-align: right;
`;

const OptionCustom = styled(FancyButton)<{
  active?: boolean;
  warning?: boolean;
}>`
  height: 2rem;
  position: relative;
  padding: 0 0.75rem;
  flex: 1;

  input {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 2rem;
  }
`;

const SlippageEmojiContainer = styled("span")`
  color: #f3841e;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
  }
`;

export interface SlippageTabsProps {
  rawSlippage: number;
  setRawSlippage: (rawSlippage: number) => void;
  deadline: number;
  setDeadline: (deadline: number) => void;
}

const SlippageTabs: FC<SlippageTabsProps> = ({
  rawSlippage,
  setRawSlippage,
  deadline,
  setDeadline,
}) => {
  const inputRef = useRef<HTMLInputElement>();

  const [slippageInput, setSlippageInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");

  const slippageInputIsValid =
    slippageInput === "" ||
    (rawSlippage / 100).toFixed(2) ===
      Number.parseFloat(slippageInput).toFixed(2);
  const deadlineInputIsValid =
    deadlineInput === "" || (deadline / 60).toString() === deadlineInput;

  let slippageError: SlippageError | undefined;
  if (slippageInput !== "" && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput;
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow;
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh;
  } else {
    slippageError = undefined;
  }

  let deadlineError: DeadlineError | undefined;
  if (deadlineInput !== "" && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput;
  } else {
    deadlineError = undefined;
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value);

    const valueAsIntFromRoundedFloat = Number.parseInt(
      (Number.parseFloat(value) * 100).toString()
    );
    if (
      !Number.isNaN(valueAsIntFromRoundedFloat) &&
      valueAsIntFromRoundedFloat < 5000
    ) {
      setRawSlippage(valueAsIntFromRoundedFloat);
    }
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value);

    const valueAsInt: number = Number.parseInt(value) * 60;
    if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
      setDeadline(valueAsInt);
    }
  }

  return (
    <AutoColumn gap="md">
      <AutoColumn gap="sm">
        <RowFixed color={"#4F658C"}>
          <TYPE.main fontWeight={400} fontSize={14} color="#b7c8e5">
            Slippage tolerance
          </TYPE.main>
          <QuestionHelper text="Your transaction will revert if the price changes unfavorably by more than this percentage." />
        </RowFixed>
        <RowBetween>
          <Option
            onClick={() => {
              setSlippageInput("");
              setRawSlippage(10);
            }}
            active={rawSlippage === 10}
            className={rawSlippage === 10 ? "active" : ""}
          >
            0.1%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput("");
              setRawSlippage(50);
            }}
            active={rawSlippage === 50}
            className={rawSlippage === 50 ? "active" : ""}
          >
            0.5%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput("");
              setRawSlippage(100);
            }}
            active={rawSlippage === 100}
            className={rawSlippage === 100 ? "active" : ""}
          >
            1%
          </Option>
          <OptionCustom
            active={![10, 50, 100].includes(rawSlippage)}
            warning={!slippageInputIsValid}
            tabIndex={-1}
            className={![10, 50, 100].includes(rawSlippage) ? "active" : ""}
          >
            <RowBetween>
              {!!slippageInput &&
              (slippageError === SlippageError.RiskyLow ||
                slippageError === SlippageError.RiskyHigh) ? (
                <SlippageEmojiContainer>
                  <span role="img" aria-label="warning">
                    ⚠️
                  </span>
                </SlippageEmojiContainer>
              ) : null}
              {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
              <Input
                ref={inputRef as any}
                placeholder={(rawSlippage / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((rawSlippage / 100).toFixed(2));
                }}
                onChange={(e) => parseCustomSlippage(e.target.value)}
                color={!slippageInputIsValid ? "red" : ""}
              />
              %
            </RowBetween>
          </OptionCustom>
        </RowBetween>
        {!!slippageError && (
          <RowBetween
            sx={{
              fontSize: "14px",
              paddingTop: "7px",
              color:
                slippageError === SlippageError.InvalidInput
                  ? "#f3841e"
                  : "#F3841E",
            }}
          >
            {slippageError === SlippageError.InvalidInput
              ? "Enter a valid slippage percentage"
              : slippageError === SlippageError.RiskyLow
              ? "Your transaction may fail"
              : "Your transaction may be frontrun"}
          </RowBetween>
        )}
      </AutoColumn>

      <AutoColumn gap="sm">
        <RowFixed color={"#4F658C"}>
          <TYPE.main fontSize={14} fontWeight={400} color="#b7c8e5">
            Transaction deadline
          </TYPE.main>
          <QuestionHelper text="Your transaction will revert if it is pending for more than this long." />
        </RowFixed>
        <RowFixed>
          <OptionCustom style={{ width: "80px" }} tabIndex={-1}>
            <Input
              color={deadlineError ? "red" : undefined}
              onBlur={() => {
                parseCustomDeadline((deadline / 60).toString());
              }}
              placeholder={(deadline / 60).toString()}
              value={deadlineInput}
              onChange={(e) => parseCustomDeadline(e.target.value)}
            />
          </OptionCustom>
          <TYPE.body style={{ paddingLeft: "8px" }} fontSize={14}>
            minutes
          </TYPE.body>
        </RowFixed>
      </AutoColumn>
    </AutoColumn>
  );
};

export default SlippageTabs;
