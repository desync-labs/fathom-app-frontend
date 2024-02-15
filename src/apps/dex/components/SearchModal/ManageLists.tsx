import {
  memo,
  useCallback,
  useMemo,
  MouseEvent,
  useState,
  useEffect,
  FC,
} from "react";
import ReactGA from "react-ga4";
import { useDispatch, useSelector } from "react-redux";
import { Box, IconButton, Popover, styled } from "@mui/material";
import { TokenList } from "@uniswap/token-lists";

import { useFetchListCallback } from "apps/dex/hooks/useFetchListCallback";
import { AppDispatch, AppState } from "apps/dex/state";
import {
  acceptListUpdate,
  removeList,
  disableList,
  enableList,
} from "apps/dex/state/lists/actions";
import {
  useIsListActive,
  useAllLists,
  useActiveListUrls,
} from "apps/dex/state/lists/hooks";
import {
  ExternalLink,
  LinkStyledButton,
  TYPE,
  IconWrapper,
} from "apps/dex/theme";
import listVersionLabel from "apps/dex/utils/listVersionLabel";
import { parseENSAddress } from "apps/dex/utils/parseENSAddress";
import uriToHttp from "apps/dex/utils/uriToHttp";
import { ButtonPrimary } from "apps/dex/components/Button";
import Column, { AutoColumn } from "apps/dex/components/Column";
import ListLogo from "apps/dex/components/ListLogo";
import Row, { RowFixed, RowBetween } from "apps/dex/components/Row";
import {
  PaddedColumn,
  SearchInput,
  Separator,
  SeparatorDark,
} from "apps/dex/components/SearchModal/styleds";
import { useListColor } from "apps/dex/hooks/useColor";
import ListToggle from "apps/dex/components/Toggle/ListToggle";
import Card from "apps/dex/components/Card";
import { CurrencyModalView } from "apps/dex/components/SearchModal/CurrencySearchModal";
import { SUPPORTED_LIST_URLS } from "apps/dex/constants/lists";

import SettingsIcon from "@mui/icons-material/Settings";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const Wrapper = styled(Column)`
  width: 100%;
  height: 100%;
`;

const UnpaddedLinkStyledButton = styled(LinkStyledButton)`
  padding: 0;
  font-size: 1rem;
  opacity: ${({ disabled }) => (disabled ? "0.4" : "1")};
`;

const StyledMenu = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`;

const StyledTitleText = styled(Box)<{ active: boolean }>`
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  color: ${({ active }) => (active ? "#ffffff" : "#4F658C")};
`;

const StyledListUrlText = styled(TYPE.main)<{ active: boolean }>`
  font-size: 12px;
  color: ${({ active }) => (active ? "#ffffff" : "#4F658C")};
`;

const RowWrapper = styled(Row)<{ bgColor: string; active: boolean }>`
  background-color: ${({ bgColor, active }) =>
    active ? bgColor ?? "transparent" : "#061023"};
  transition: 200ms;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
`;

const PopoverWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #253656;
  padding: 16px;
`;

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, "-")}`;
}

const ListRow: FC<{ listUrl: string }> = memo(({ listUrl }) => {
  const listsByUrl = useSelector<AppState, AppState["lists"]["byUrl"]>(
    (state) => state.lists.byUrl
  );
  const dispatch = useDispatch<AppDispatch>();
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl];

  const listColor = useListColor(list?.logoURI);
  const isActive = useIsListActive(listUrl);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "settings_popover" : undefined;

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return;
    ReactGA.event({
      category: "Lists",
      action: "Update List from List Select",
      label: listUrl,
    });
    dispatch(acceptListUpdate(listUrl));
  }, [dispatch, listUrl, pending]);

  const handleRemoveList = useCallback(() => {
    ReactGA.event({
      category: "Lists",
      action: "Start Remove List",
      label: listUrl,
    });
    if (
      window.prompt(
        `Please confirm you would like to remove this list by typing REMOVE`
      ) === `REMOVE`
    ) {
      ReactGA.event({
        category: "Lists",
        action: "Confirm Remove List",
        label: listUrl,
      });
      dispatch(removeList(listUrl));
    }
  }, [dispatch, listUrl]);

  const handleEnableList = useCallback(() => {
    ReactGA.event({
      category: "Lists",
      action: "Enable List",
      label: listUrl,
    });
    dispatch(enableList(listUrl));
  }, [dispatch, listUrl]);

  const handleDisableList = useCallback(() => {
    ReactGA.event({
      category: "Lists",
      action: "Disable List",
      label: listUrl,
    });
    dispatch(disableList(listUrl));
  }, [dispatch, listUrl]);

  if (!list) return null;

  return (
    <RowWrapper
      active={isActive}
      bgColor={listColor}
      key={listUrl}
      id={listUrlRowHTMLId(listUrl)}
    >
      {list.logoURI ? (
        <ListLogo
          size="40px"
          style={{ marginRight: "1rem" }}
          logoURI={list.logoURI}
          alt={`${list.name} list logo`}
        />
      ) : (
        <div style={{ width: "24px", height: "24px", marginRight: "1rem" }} />
      )}
      <Column style={{ flex: "1" }}>
        <Row>
          <StyledTitleText active={isActive}>{list.name}</StyledTitleText>
        </Row>
        <RowFixed mt="4px">
          <StyledListUrlText active={isActive} mr="6px">
            {list.tokens.length} tokens
          </StyledListUrlText>
          <StyledMenu>
            <IconButton onClick={handleClick}>
              <SettingsIcon
                sx={{
                  width: "12px",
                  height: "12px",
                  color: isActive ? "#131F35" : "#ffffff",
                }}
              />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <PopoverWrapper>
                <div>{list && listVersionLabel(list.version)}</div>
                <SeparatorDark />
                <ExternalLink
                  href={`https://tokenlists.org/token-list?url=${listUrl}`}
                >
                  View list
                </ExternalLink>
                <UnpaddedLinkStyledButton
                  onClick={handleRemoveList}
                  disabled={Object.keys(listsByUrl).length === 1}
                >
                  Remove list
                </UnpaddedLinkStyledButton>
                {pending && (
                  <UnpaddedLinkStyledButton onClick={handleAcceptListUpdate}>
                    Update list
                  </UnpaddedLinkStyledButton>
                )}
              </PopoverWrapper>
            </Popover>
          </StyledMenu>
        </RowFixed>
      </Column>
      <ListToggle
        isActive={isActive}
        bgColor={listColor}
        toggle={() => {
          isActive ? handleDisableList() : handleEnableList();
        }}
      />
    </RowWrapper>
  );
});

const ListContainer = styled(Box)`
  height: 100%;
  overflow: auto;
  padding: 1rem 1rem 80px;
`;

export function ManageLists({
  setModalView,
  setImportList,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) {
  const [listUrlInput, setListUrlInput] = useState<string>("");

  const lists = useAllLists();

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls();
  const [activeCopy, setActiveCopy] = useState<string[] | undefined>();
  useEffect(() => {
    if (!activeCopy && activeListUrls) {
      setActiveCopy(activeListUrls);
    }
  }, [activeCopy, activeListUrls]);

  const handleInput = useCallback((e: any) => {
    setListUrlInput(e.target.value);
  }, []);

  const fetchList = useFetchListCallback();

  const validUrl: boolean = useMemo(() => {
    return (
      uriToHttp(listUrlInput).length > 0 ||
      Boolean(parseENSAddress(listUrlInput))
    );
  }, [listUrlInput]);

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists);
    return listUrls
      .filter((listUrl) => {
        // only show loaded lists, hide unsupported lists
        return (
          Boolean(lists[listUrl].current) &&
          SUPPORTED_LIST_URLS.includes(listUrl)
        );
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1];
        const { current: l2 } = lists[u2];

        // first filter on active lists
        if (activeCopy?.includes(u1) && !activeCopy?.includes(u2)) {
          return -1;
        }
        if (!activeCopy?.includes(u1) && activeCopy?.includes(u2)) {
          return 1;
        }

        if (l1 && l2) {
          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1;
        }
        if (l1) return -1;
        if (l2) return 1;
        return 0;
      });
  }, [lists, activeCopy]);

  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>();
  const [addError, setAddError] = useState<string | undefined>();

  useEffect(() => {
    async function fetchTempList() {
      fetchList(listUrlInput, false)
        .then((list) => setTempList(list))
        .catch(() => setAddError("Error importing list"));
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList();
    } else {
      setTempList(undefined);
      listUrlInput !== "" && setAddError("Enter valid list location");
    }

    // reset error
    if (listUrlInput === "") {
      setAddError(undefined);
    }
  }, [fetchList, listUrlInput, validUrl]);

  // check if a list is already imported
  const isImported = Object.keys(lists).includes(listUrlInput);

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return;
    setImportList(tempList);
    setModalView(CurrencyModalView.importList);
    setListUrl(listUrlInput);
  }, [listUrlInput, setImportList, setListUrl, setModalView, tempList]);

  return (
    <Wrapper>
      <PaddedColumn gap="14px">
        <Row>
          <SearchInput
            type="text"
            id="list-add-input"
            placeholder="https:// or ipfs:// or ENS name"
            value={listUrlInput}
            onChange={handleInput}
          />
        </Row>
        {addError ? (
          <TYPE.error
            title={addError}
            style={{ textOverflow: "ellipsis", overflow: "hidden" }}
            error
          >
            {addError}
          </TYPE.error>
        ) : null}
      </PaddedColumn>
      {tempList && (
        <PaddedColumn style={{ paddingTop: 0 }}>
          <Card bgcolor={"#061023"} padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {tempList.logoURI && (
                  <ListLogo logoURI={tempList.logoURI} size="40px" />
                )}
                <AutoColumn gap="4px" style={{ marginLeft: "20px" }}>
                  <TYPE.body fontWeight={600}>{tempList.name}</TYPE.body>
                  <TYPE.main fontSize={"12px"}>
                    {tempList.tokens.length} tokens
                  </TYPE.main>
                </AutoColumn>
              </RowFixed>
              {isImported ? (
                <RowFixed>
                  <IconWrapper
                    color="#4F658C"
                    stroke="transparent"
                    size="16px"
                    marginRight={"10px"}
                  >
                    <TaskAltIcon />
                  </IconWrapper>
                  <TYPE.body color={"#4F658C"}>Loaded</TYPE.body>
                </RowFixed>
              ) : (
                <ButtonPrimary
                  style={{ fontSize: "14px" }}
                  padding="6px 8px"
                  width="fit-content"
                  onClick={handleImport}
                >
                  Import
                </ButtonPrimary>
              )}
            </RowBetween>
          </Card>
        </PaddedColumn>
      )}
      <Separator />
      <ListContainer>
        <AutoColumn gap="md">
          {sortedLists.map((listUrl) => (
            <ListRow key={listUrl} listUrl={listUrl} />
          ))}
        </AutoColumn>
      </ListContainer>
    </Wrapper>
  );
}
