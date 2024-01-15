import { Currency, XDC, Token } from "into-the-fathom-swap-sdk";
import {
  FC,
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactGA from "react-ga4";
import { FixedSizeList } from "react-window";
import { Text } from "rebass";
import { useActiveWeb3React } from "apps/dex/hooks";
import {
  useAllTokens,
  useToken,
  useIsUserAddedToken,
  useFoundOnInactiveList,
} from "apps/dex/hooks/Tokens";
import { CloseIcon, TYPE, ButtonText, IconWrapper } from "apps/dex/theme";
import { isAddress } from "apps/dex/utils";
import Column from "apps/dex/components/Column";
import Row, { RowBetween, RowFixed } from "apps/dex/components/Row";
import CommonBases from "apps/dex/components/SearchModal/CommonBases";
import CurrencyList from "apps/dex/components/SearchModal/CurrencyList";
import {
  filterTokens,
  useSortedTokensByQuery,
} from "apps/dex/components/SearchModal/filtering";
import { useTokenComparator } from "./sorting";
import { PaddedColumn, SearchInput, Separator } from "./styleds";
import AutoSizer from "react-virtualized-auto-sizer";
import styled from "styled-components";
import useToggle from "apps/dex/hooks/useToggle";
import { useOnClickOutside } from "apps/dex/hooks/useOnClickOutside";
import useTheme from "apps/dex/hooks/useTheme";
import ImportRow from "apps/dex/components/SearchModal/ImportRow";
import { Edit } from "react-feather";
import useDebounce from "apps/dex/hooks/useDebounce";

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`;

const Footer = styled.div`
  width: 100%;
  border-radius: 20px;
  padding: 20px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${({ theme }) => theme.modalContentBG};
  border-top: 1px solid ${({ theme }) => theme.bg2};
`;

interface CurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  showManageView: () => void;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}

export const CurrencySearch: FC<CurrencySearchProps> = ({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken,
}) => {
  const { chainId } = useActiveWeb3React();
  const theme = useTheme();

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 200);

  const [invertSearchOrder] = useState<boolean>(false);

  const allTokens = useAllTokens();

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery);
  const searchToken = useToken(debouncedQuery);
  const searchTokenIsAdded = useIsUserAddedToken(searchToken);

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: "Currency Select",
        action: "Search by address",
        label: isAddressSearch,
      });
    }
  }, [isAddressSearch]);

  const showXDC: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim();
    return s === "" || s === "x" || s === "xd" || s === "xdc";
  }, [debouncedQuery]);

  const tokenComparator = useTokenComparator(invertSearchOrder);

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery);
  }, [allTokens, debouncedQuery]);

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator);
  }, [filteredTokens, tokenComparator]);

  const filteredSortedTokens = useSortedTokensByQuery(
    sortedTokens,
    debouncedQuery
  );

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect]
  );

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery("");
  }, [isOpen]);

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event: any) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === "xdc") {
          handleCurrencySelect(XDC);
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() ===
              debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0]);
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery]
  );

  // menu ui
  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, open ? toggle : undefined);

  // if no results on main list, show option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery);
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(
    inactiveTokens,
    debouncedQuery
  );

  return (
    <ContentWrapper>
      <PaddedColumn gap="16px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            Select a token
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <Row>
          <SearchInput
            type="text"
            id="token-search-input"
            placeholder={"Search Token"}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </Row>
        {showCommonBases && (
          <CommonBases
            chainId={chainId}
            onSelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
          />
        )}
      </PaddedColumn>
      <Separator />
      {searchToken && !searchTokenIsAdded ? (
        <Column style={{ padding: "20px 0", height: "100%" }}>
          <ImportRow
            token={searchToken}
            showImportView={showImportView}
            setImportToken={setImportToken}
          />
        </Column>
      ) : filteredSortedTokens?.length > 0 ||
        filteredInactiveTokens?.length > 0 ? (
        <div style={{ flex: "1" }}>
          <AutoSizer disableWidth>
            {({ height }: { height: number }) => (
              <CurrencyList
                height={height}
                showXDC={showXDC}
                currencies={
                  filteredInactiveTokens
                    ? filteredSortedTokens.concat(filteredInactiveTokens)
                    : filteredSortedTokens
                }
                breakIndex={
                  inactiveTokens && filteredSortedTokens
                    ? filteredSortedTokens.length
                    : undefined
                }
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
                showImportView={showImportView}
                setImportToken={setImportToken}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <Column style={{ padding: "20px", height: "100%" }}>
          <TYPE.main textAlign="center" mb="20px">
            No results found.
          </TYPE.main>
        </Column>
      )}
      <Footer>
        <Row justify="center">
          <ButtonText
            onClick={showManageView}
            color={theme?.blue1}
            className="list-token-manage-button"
          >
            <RowFixed>
              <IconWrapper size="16px" marginRight="6px">
                <Edit />
              </IconWrapper>
              <TYPE.white>Manage</TYPE.white>
            </RowFixed>
          </ButtonText>
        </Row>
      </Footer>
    </ContentWrapper>
  );
};
