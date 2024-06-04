import { FC, useState } from "react";
import { Box, styled, Typography } from "@mui/material";
import { TokenList } from "@uniswap/token-lists";
import { Token } from "into-the-fathom-swap-sdk";

import {
  PaddedColumn,
  Separator,
} from "apps/dex/components/SearchModal/styleds";
import { RowBetween } from "apps/dex/components/Row";
import { ManageLists } from "apps/dex/components/SearchModal/ManageLists";
import ManageTokens from "apps/dex/components/SearchModal/ManageTokens";
import { CurrencyModalView } from "apps/dex/components/SearchModal/CurrencySearchModal";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CloseIcon } from "apps/dex/theme";

const Wrapper = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ToggleWrapper = styled(RowBetween)`
  background-color: #061023;
  border-radius: 8px;
  padding: 6px;
`;

const ToggleOption = styled(Box)<{ active?: boolean }>`
  width: 48%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  background-color: ${({ active }) => (active ? "#43FFF6" : "#131F35")};
  color: ${({ active }) => (active ? "#00332F" : "#4F658C")};
  user-select: none;
  border: 1px solid ${({ active }) => (active ? "#43FFF6" : "#131F35")};

  :hover {
    background-color: ${({ active }) => (active ? "transparent" : "#131F35")};
    color: ${({ active }) => (active ? "#43FFF6" : "#4F658C")};
    border: 1px solid #43fff6;
    cursor: pointer;
    opacity: 0.7;
  }
`;

type ManageProps = {
  onDismiss: () => void;
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
};

const Manage: FC<ManageProps> = ({
  onDismiss,
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}) => {
  // toggle between tokens and lists
  const [showLists, setShowLists] = useState(true);

  return (
    <Wrapper>
      <PaddedColumn>
        <RowBetween>
          <ArrowBackIcon
            style={{ cursor: "pointer" }}
            onClick={() => setModalView(CurrencyModalView.search)}
          />
          <Typography fontWeight={500} fontSize={20}>
            Manage
          </Typography>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
      </PaddedColumn>
      <Separator />
      <PaddedColumn style={{ paddingBottom: 0 }}>
        <ToggleWrapper>
          <ToggleOption
            onClick={() => setShowLists(!showLists)}
            active={showLists}
          >
            Lists
          </ToggleOption>
          <ToggleOption
            onClick={() => setShowLists(!showLists)}
            active={!showLists}
          >
            Tokens
          </ToggleOption>
        </ToggleWrapper>
      </PaddedColumn>
      {showLists ? (
        <ManageLists
          setModalView={setModalView}
          setImportList={setImportList}
          setListUrl={setListUrl}
        />
      ) : (
        <ManageTokens
          setModalView={setModalView}
          setImportToken={setImportToken}
        />
      )}
    </Wrapper>
  );
};

export default Manage;
