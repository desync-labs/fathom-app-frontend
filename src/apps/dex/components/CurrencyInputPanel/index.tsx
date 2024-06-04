import { useState, useCallback, FC } from "react";
import { Currency, Pair } from "into-the-fathom-swap-sdk";
import { darken } from "polished";
import { Box, Button, styled } from "@mui/material";

import { useActiveWeb3React } from "apps/dex/hooks";
import { TYPE } from "apps/dex/theme";
import { useCurrencyBalance } from "apps/dex/state/wallet/hooks";
import CurrencySearchModal from "apps/dex/components/SearchModal/CurrencySearchModal";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import DoubleCurrencyLogo from "apps/dex/components/DoubleLogo";
import { RowBetween } from "apps/dex/components/Row";
import { Input as NumericalInput } from "apps/dex/components/NumericalInput";

import { ReactComponent as DropDown } from "apps/dex/assets/images/dropdown.svg";

const InputRow = styled(Box)<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: ${({ selected }) =>
    selected ? "0.75rem 0.5rem 0.75rem 1rem" : "0.75rem 0.75rem 0.75rem 1rem"};
  justify-content: space-between;
`;

const BalanceRow = styled(Box)<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: right;
  align-items: center;
  padding: ${({ selected }) =>
    selected ? "0.75rem 0.5rem 0.75rem 1rem" : "0.75rem 0.75rem 0.75rem 1rem"};
  gap: 7px;
`;

const CurrencySelect = styled(Button)<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: #253656;
  color: #ffffff;
  text-transform: capitalize;
  border-radius: 12px;
  box-shadow: ${({ selected }) =>
    selected ? "none" : "0px 6px 10px rgba(0, 0, 0, 0.075)"};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :hover {
    background-color: transparent;
  }
`;

const LabelRow = styled(Box)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: #ffffff;
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${darken(0.2, "#4F658C")};
  }
`;

const Aligner = styled("span")`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Balance = styled(Box)`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  text-transform: uppercase;
  color: #4f658c;
`;

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: #ffffff;
    stroke-width: 1.5px;
  }
`;

const InputPanel = styled(Box)`
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  border-radius: 8px;
  background-color: #061023;
  z-index: 1;

  &#swap-currency-input {
    margin-bottom: -25px;
  }

  &#add-liquidity-input-tokena {
    margin-bottom: -30px;
  }

  &#swap-currency-output {
    margin-top: -25px;
  }

  &#add-liquidity-input-tokenb {
    margin-top: -30px;
  }
`;

const Container = styled(Box)<{ hideInput: boolean }>`
  width: 100%;
  border-radius: ${({ hideInput }) => (hideInput ? "8px" : "20px")};
  border: 1px solid #061023;
  background-color: #061023;
`;

const StyledTokenName = styled("span")<{ active?: boolean }>`
  text-transform: none;
  font-size: ${({ active }) => (active ? "20px" : "16px")};
  ${({ active }) =>
    active
      ? "  margin: 0 0.25rem 0 0.75rem;"
      : "  margin: 0 0.25rem 0 0.25rem;"}
`;

const StyledBalanceMax = styled(Button)`
  height: 28px;
  background-color: #22354f;
  border: 1px solid #22354f;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  color: #43fff6;
  :hover {
    border: 1px solid #253656;
  }
  :focus {
    border: 1px solid #253656;
    outline: none;
  }
`;

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
  customBalanceText?: string;
}

const CurrencyInputPanel: FC<CurrencyInputPanelProps> = ({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = "Input",
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.main fontWeight={500} fontSize={14}>
                {label}
              </TYPE.main>
              {account && (
                <TYPE.main
                  onClick={onMax}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: "inline", cursor: "pointer" }}
                ></TYPE.main>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow
          style={hideInput ? { padding: "0", borderRadius: "8px" } : {}}
          selected={disableCurrencySelect}
        >
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true);
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo
                  currency0={pair.token0}
                  currency1={pair.token1}
                  size={24}
                  margin={true}
                />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={"24px"} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName
                  className="token-symbol-container"
                  active={Boolean(currency && currency.symbol)}
                >
                  <>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                        "..." +
                        currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length
                        )
                      : currency?.symbol) || "Select Token"}
                  </>
                </StyledTokenName>
              )}
              {!disableCurrencySelect && (
                <StyledDropDown selected={!!currency} />
              )}
            </Aligner>
          </CurrencySelect>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                align={"right"}
                onUserInput={(val) => {
                  onUserInput(val);
                }}
              />
            </>
          )}
        </InputRow>
        <BalanceRow selected={disableCurrencySelect}>
          <Balance>
            {!hideBalance && !!currency && selectedCurrencyBalance
              ? (customBalanceText ?? "Balance: ") +
                selectedCurrencyBalance?.toSignificant(6)
              : " -"}
          </Balance>
          {account && currency && showMaxButton && label !== "To" && (
            <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
          )}
        </BalanceRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  );
};

export default CurrencyInputPanel;
