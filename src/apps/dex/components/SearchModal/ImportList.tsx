import { useState, useCallback, FC } from "react";
import { useDispatch } from "react-redux";
import ReactGA from "react-ga4";
import { transparentize } from "polished";
import { TokenList } from "@uniswap/token-lists";
import { Box, styled } from "@mui/material";

import { TYPE, CloseIcon } from "apps/dex/theme";
import Card from "apps/dex/components/Card";
import { AutoColumn } from "apps/dex/components/Column";
import { RowBetween, RowFixed, AutoRow } from "apps/dex/components/Row";
import { ButtonPrimary } from "apps/dex/components/Button";
import { SectionBreak } from "apps/dex/components/swap/styleds";
import { ExternalLink } from "apps/dex/theme/components";
import ListLogo from "apps/dex/components/ListLogo";
import { PaddedColumn, Checkbox, TextDot } from "./styleds";
import { AppDispatch } from "apps/dex/state";
import { useFetchListCallback } from "apps/dex/hooks/useFetchListCallback";
import { removeList, enableList } from "apps/dex/state/lists/actions";
import { CurrencyModalView } from "apps/dex/components/SearchModal/CurrencySearchModal";
import { useAllLists } from "apps/dex/state/lists/hooks";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Wrapper = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

// const ModalContentWrapper = styled(Box)`
//     padding: 20px;
// `;

const FlexColumn = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

interface ImportProps {
  listURL: string;
  list: TokenList;
  onDismiss: () => void;
  setModalView: (view: CurrencyModalView) => void;
}

export const ImportList: FC<ImportProps> = ({
  listURL,
  list,
  setModalView,
  onDismiss,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // user must accept
  const [confirmed, setConfirmed] = useState(false);

  const lists = useAllLists();
  const fetchList = useFetchListCallback();

  // monitor is a list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddList = useCallback(() => {
    if (adding) return;
    setAddError(null);
    fetchList(listURL)
      .then(() => {
        ReactGA.event({
          category: "Lists",
          action: "Add List",
          label: listURL,
        });

        // turn a list on
        dispatch(enableList(listURL));
        // go back to lists
        setModalView(CurrencyModalView.manage);
      })
      .catch((error) => {
        ReactGA.event({
          category: "Lists",
          action: "Add List Failed",
          label: listURL,
        });
        setAddError(error.message);
        dispatch(removeList(listURL));
      });
  }, [adding, dispatch, fetchList, listURL, setModalView]);

  return (
    <Wrapper>
      <PaddedColumn gap="14px" style={{ width: "100%", flex: "1 1" }}>
        <RowBetween>
          <ArrowBackIcon
            style={{ cursor: "pointer" }}
            onClick={() => setModalView(CurrencyModalView.manage)}
          />
          <TYPE.mediumHeader>Import List</TYPE.mediumHeader>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
      </PaddedColumn>
      <SectionBreak />
      <PaddedColumn gap="md" sx={{ height: "calc(100% - 65px)" }}>
        <FlexColumn>
          <Card bgcolor="#061023" padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {list.logoURI && (
                  <ListLogo logoURI={list.logoURI} size="40px" />
                )}
                <AutoColumn gap="sm" style={{ marginLeft: "20px" }}>
                  <RowFixed>
                    <TYPE.body fontWeight={600} mr="6px">
                      {list.name}
                    </TYPE.body>
                    <TextDot />
                    <TYPE.main fontSize={"16px"} ml="6px">
                      {list.tokens.length} tokens
                    </TYPE.main>
                  </RowFixed>
                  <ExternalLink
                    href={`https://tokenlists.org/token-list?url=${listURL}`}
                  >
                    <TYPE.main fontSize={"12px"} color="#2172E5">
                      {listURL}
                    </TYPE.main>
                  </ExternalLink>
                </AutoColumn>
              </RowFixed>
            </RowBetween>
          </Card>
          <Card
            style={{
              backgroundColor: transparentize(0.8, "#FD4040"),
            }}
          >
            <AutoColumn
              justify="center"
              style={{ textAlign: "center", gap: "16px", marginBottom: "12px" }}
            >
              <ErrorOutlineIcon
                sx={{
                  color: "#FD4040",
                  height: "32px",
                  width: "32px",
                }}
              />
              <TYPE.body fontWeight={500} fontSize={20} color="#FD4040">
                Import at your own risk{" "}
              </TYPE.body>
            </AutoColumn>

            <AutoColumn
              style={{ textAlign: "center", gap: "16px", marginBottom: "12px" }}
            >
              <TYPE.body fontWeight={500} color="#FD4040">
                By adding this list you are implicitly trusting that the data is
                correct. Anyone can create a list, including creating fake
                versions of existing lists and lists that claim to represent
                projects that do not have one.
              </TYPE.body>
              <TYPE.body fontWeight={600} color="#FD4040">
                If you purchase a token from this list, you may not be able to
                sell it back.
              </TYPE.body>
            </AutoColumn>
            <AutoRow
              justify="center"
              style={{ cursor: "pointer" }}
              onClick={() => setConfirmed(!confirmed)}
            >
              <Checkbox
                name="confirmed"
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
              />
              <TYPE.body
                ml="10px"
                fontSize="16px"
                color="#FD4040"
                fontWeight={500}
              >
                I understand
              </TYPE.body>
            </AutoRow>
          </Card>

          <ButtonPrimary
            disabled={!confirmed}
            altDisabledStyle={true}
            borderRadius="20px"
            padding="10px 1rem"
            onClick={handleAddList}
          >
            Import
          </ButtonPrimary>
          {addError ? (
            <TYPE.error
              title={addError}
              style={{ textOverflow: "ellipsis", overflow: "hidden" }}
              error
            >
              {addError}
            </TYPE.error>
          ) : null}
        </FlexColumn>
        {/* </Card> */}
      </PaddedColumn>
    </Wrapper>
  );
};
