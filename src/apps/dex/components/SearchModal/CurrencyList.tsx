import {
  CSSProperties,
  FC,
  MutableRefObject,
  useCallback,
  useMemo,
} from "react";
import {
  Currency,
  CurrencyAmount,
  currencyEquals,
  XDC,
  Token,
} from "into-the-fathom-swap-sdk";
import { FixedSizeList } from "react-window";
import { Box, styled, Typography } from "@mui/material";

import { useActiveWeb3React } from "apps/dex/hooks";
import { useCombinedActiveList } from "apps/dex/state/lists/hooks";
import { useCurrencyBalance } from "apps/dex/state/wallet/hooks";
import { TYPE } from "apps/dex/theme";
import {
  useIsUserAddedToken,
  useAllInactiveTokens,
} from "apps/dex/hooks/Tokens";
import Column from "apps/dex/components/Column";
import { RowFixed, RowBetween } from "apps/dex/components/Row";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import { MenuItem } from "apps/dex/components/SearchModal/styleds";
import Loader from "apps/dex/components/Loader";
import { isTokenOnList } from "apps/dex/utils";
import ImportRow from "apps/dex/components/SearchModal/ImportRow";
import { wrappedCurrency } from "apps/dex/utils/wrappedCurrency";
import { LightGreyCard } from "apps/dex/components/Card";
import TokenListLogo from "apps/dex/assets/svg/tokenlist.svg";
import QuestionHelper from "apps/dex/components/QuestionHelper";

function currencyKey(currency: Currency): string {
  return currency instanceof Token
    ? currency.address
    : currency === XDC
    ? "XDC"
    : "";
}

const StyledBalanceText = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`;

const FixedContentRow = styled(Box)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`;

function Balance({ balance }: { balance: CurrencyAmount }) {
  return (
    <StyledBalanceText title={balance.toExact()}>
      {balance.toSignificant(4)}
    </StyledBalanceText>
  );
}

const TokenListLogoWrapper = styled("img")`
  height: 20px;
`;

type CurrencyRowProps = {
  currency: Currency;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
};

const CurrencyRow: FC<CurrencyRowProps> = ({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}) => {
  const { account } = useActiveWeb3React();
  const key = currencyKey(currency);
  const selectedTokenList = useCombinedActiveList();
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency);
  const customAdded = useIsUserAddedToken(currency);
  const balance = useCurrencyBalance(account ?? undefined, currency);

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <CurrencyLogo currency={currency} size={"24px"} />
      <Column>
        <Typography title={currency.name} fontWeight={500}>
          {currency.symbol}
        </Typography>
        <TYPE.white ml="0px" fontSize={"12px"} fontWeight={300}>
          {currency.name}{" "}
          {!isOnSelectedList && customAdded && "• Added by user"}
        </TYPE.white>
      </Column>
      <RowFixed style={{ justifySelf: "flex-end" }}>
        {balance ? (
          <Balance balance={balance} />
        ) : account ? (
          <Loader stroke={"white"} />
        ) : null}
      </RowFixed>
    </MenuItem>
  );
};

type CurrencyListProps = {
  height: number;
  currencies: Currency[];
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherCurrency?: Currency | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
  showXDC: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
  breakIndex: number | undefined;
};

const CurrencyList: FC<CurrencyListProps> = ({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showXDC,
  showImportView,
  setImportToken,
  breakIndex,
}) => {
  const { chainId } = useActiveWeb3React();
  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showXDC
      ? [Currency.XDC, ...currencies]
      : currencies;
    if (breakIndex !== undefined) {
      formatted = [
        ...formatted.slice(0, breakIndex),
        undefined,
        ...formatted.slice(breakIndex, formatted.length),
      ];
    }
    return formatted;
  }, [breakIndex, currencies, showXDC]);

  const inactiveTokens: {
    [address: string]: Token;
  } = useAllInactiveTokens();

  const Row = useCallback(
    ({ data, index, style }: { data: any; index: number; style: any }) => {
      const currency: Currency = data[index];
      const isSelected = Boolean(
        selectedCurrency && currencyEquals(selectedCurrency, currency)
      );
      const otherSelected = Boolean(
        otherCurrency && currencyEquals(otherCurrency, currency)
      );
      const handleSelect = () => onCurrencySelect(currency);

      const token = wrappedCurrency(currency, chainId);

      const showImport =
        inactiveTokens &&
        token &&
        Object.keys(inactiveTokens).includes(token.address);

      if (index === breakIndex || !data) {
        return (
          <FixedContentRow style={style}>
            <LightGreyCard sx={{ padding: "8px 12px", borderRadius: "8px" }}>
              <RowBetween alignItems={"center"}>
                <RowFixed>
                  <TokenListLogoWrapper src={TokenListLogo} />
                  <TYPE.main ml="6px" fontSize="12px" color="#fff">
                    Expanded results from inactive Token Lists
                  </TYPE.main>
                </RowFixed>
                <QuestionHelper text="Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists." />
              </RowBetween>
            </LightGreyCard>
          </FixedContentRow>
        );
      }

      if (showImport && token) {
        return (
          <ImportRow
            style={style}
            token={token}
            showImportView={showImportView}
            setImportToken={setImportToken}
            dim={true}
          />
        );
      } else {
        return (
          <CurrencyRow
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
          />
        );
      }
    },
    [
      chainId,
      inactiveTokens,
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      setImportToken,
      showImportView,
      breakIndex,
    ]
  );

  const itemKey = useCallback(
    (index: number, data: any) => currencyKey(data[index]),
    []
  );

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  );
};

export default CurrencyList;
