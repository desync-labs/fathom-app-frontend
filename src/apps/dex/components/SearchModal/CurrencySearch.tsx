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
import { Currency, XDC, Token } from "into-the-fathom-swap-sdk";
import ReactGA from "react-ga4";
import { Box, styled, Typography } from "@mui/material";

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
import useToggle from "apps/dex/hooks/useToggle";
import { useOnClickOutside } from "apps/dex/hooks/useOnClickOutside";
import ImportRow from "apps/dex/components/SearchModal/ImportRow";
import useDebounce from "apps/dex/hooks/useDebounce";

import EditIcon from "@mui/icons-material/Edit";

const ContentWrapper = styled(Column)`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Footer = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 20px 0;
  background-color: #1d2d49;
  border-top: 1px solid #061023;
  z-index: 9;
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

  // if no results on the main list, show an option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery);
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(
    inactiveTokens,
    debouncedQuery
  );

  return (
    <ContentWrapper>
      <PaddedColumn gap="16px">
        <RowBetween>
          <Typography fontWeight={500} fontSize={16}>
            Select a token
          </Typography>
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
        <CurrencyList
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
          showImportView={showImportView}
          setImportToken={setImportToken}
        />
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
            className="list-token-manage-button"
            sx={{ color: "#2172E5", height: "unset" }}
          >
            <RowFixed>
              <IconWrapper size="16px" marginRight="6px">
                <EditIcon
                  sx={{ color: "transparent", width: "20px", height: "20px" }}
                />
              </IconWrapper>
              <TYPE.white>Manage</TYPE.white>
            </RowFixed>
          </ButtonText>
        </Row>
      </Footer>
    </ContentWrapper>
  );
};
